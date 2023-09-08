import { AdminRequestValidator } from '$lib/server/api/AdminRequestValidator';
import { error, type RequestEvent } from '@sveltejs/kit';
import pLimit from 'p-limit';

export class AsyncApiManager {
	runner = pLimit(10);
	queue: Promise<void>[] = [];
	running = false;
	isRateLimited = false;
	tasksDone = 0;

	validate(event: RequestEvent) {
		new AdminRequestValidator(event).validate();
	}

	start() {
		if (this.running) {
			throw error(429, 'limit');
		}
		this.running = true;
	}

	handleTaskError(e: any) {
		if (e instanceof Error) {
			console.log(`Failed task`, e.message);
		}
		if (e.status === 403) {
			this.isRateLimited = true;
			const reset = e.response.headers['x-ratelimit-reset'];
			console.log('Rate limit rill reset at UTC: ', new Date(reset * 1000));
		}
	}

	handleFinally(totalTasks: number) {
		return () => {
			this.tasksDone++;
			console.log(`${this.tasksDone}/${totalTasks} tasks done.`);
			console.log("Exiting")
			process.exit(1)
		};
	}

	async deferCleanup() {
		await Promise.all(this.queue);
		console.log('Async job completed.');
		this.isRateLimited = false;
		this.tasksDone = 0;
		this.queue = [];
		this.runner = pLimit(10);
		this.running = false;
	}

	addToQueue(callback: () => Promise<void>) {
		this.queue.push(this.runner(callback));
	}
}

type asyncTaskGetter = () => Promise<(() => Promise<void>)[]>;

export function createAsyncTaskApi(getAsyncTasks: asyncTaskGetter) {
	const manager = new AsyncApiManager();
	return async (event: RequestEvent) => {
		manager.validate(event);
		manager.start();

		const tasks = await getAsyncTasks();

		for (const task of tasks) {
			manager.addToQueue(async () => {
				if (manager.isRateLimited) {
					return;
				}
				return task()
					.catch((e) => manager.handleTaskError(e))
					.finally(manager.handleFinally(tasks.length));
			});
		}

		manager.deferCleanup();

		return new Response('Sync started');
	};
}
