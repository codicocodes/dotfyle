import { AdminRequestValidator } from '$lib/server/api/AdminRequestValidator';
import { error, type RequestEvent } from '@sveltejs/kit';
import pLimit from 'p-limit';

export const createBulkApi = (getTasks: () => Promise<(() => Promise<void>)[]>) => {
	const runner = pLimit(10);
	let running = false;

	function start(event: RequestEvent) {
		new AdminRequestValidator(event).validate();
		if (running) {
			throw error(429, 'limit');
		}
		running = true;
	}

	return async (event: RequestEvent) => {
		let rateLimitedTasks = false;
		let tasksDone = 0;

		function handleError(e: any) {
			if (e instanceof Error) {
				console.log(`Failed task`, e.message);
			}
			if (e.status === 403) {
				rateLimitedTasks = true;
				const reset = e.response.headers['x-ratelimit-reset'];
				console.log('Rate limit rill reset at UTC: ', new Date(reset * 1000));
			}
		}

		function handleFinally(totalTasks: number) {
			return () => {
				tasksDone++;
				console.log(`${tasksDone}/${totalTasks} tasks done.`);
			};
		}

		start(event);

		const tasks = await getTasks();

		for (const task of tasks) {
			runner(() => {
				if (rateLimitedTasks) {
					return;
				}
				task().catch(handleError).finally(handleFinally(tasks.length));
			});
		}

		runner(async () => {
			running = false;
			rateLimitedTasks = false;
		});

		return new Response();
	};
};
