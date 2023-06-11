import { AdminRequestValidator } from '$lib/server/api/AdminRequestValidator';
import { error, type RequestEvent } from '@sveltejs/kit';
import pLimit from 'p-limit';

export class AsyncApiManager {
	runner = pLimit(10);
	running = false;
	isRateLimited = false;
	tasksDone = 0;

  validate(event: RequestEvent) {
		new AdminRequestValidator(event).validate();
  }

	lock() {
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
		};
	}

	deferCleanup() {
		this.runner(async () => {
			this.running = false;
			this.isRateLimited = false;
			this.tasksDone = 0;
      console.log("Async job completed.")
		});
	}
}

type asyncTaskGetter = () => Promise<(() => Promise<void>)[]>;

export function createAsyncTaskApi(getAsyncTasks: asyncTaskGetter) {
  const manager = new AsyncApiManager()
	return async (event: RequestEvent) => {
		manager.validate(event);
		manager.lock();

		const tasks = await getAsyncTasks();

		for (const task of tasks) {
			manager.runner(() => {
				if (manager.isRateLimited) {
					return;
				}
				task()
					.catch((e) => manager.handleTaskError(e))
					.finally(manager.handleFinally(tasks.length));
			});
		}

		manager.deferCleanup();

		return new Response();
	};
}
