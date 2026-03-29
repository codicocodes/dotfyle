import { AdminRequestValidator } from '$lib/server/api/AdminRequestValidator';
import { error, type RequestEvent } from '@sveltejs/kit';

type AsyncTaskSource = () => AsyncIterable<() => Promise<void>>;

const CONCURRENCY = 10;

function handleTaskError(e: unknown, stop: () => void) {
  const err = e as {
    status?: number;
    message?: string;
    rateLimitReset?: number;
    rateLimitLimit?: number;
  };

  const isForbidden = err?.status === 403;
  const isSuspendedAccount = err?.message?.includes('Sorry. Your account was suspended');
  if (isForbidden && !isSuspendedAccount) {
    stop();
    const reset = new Date((err.rateLimitReset ?? 0) * 1000).toUTCString();
    console.log(`Rate limited (limit: ${err.rateLimitLimit ?? 'unknown'}). Resets at: ${reset}`);
    throw e;
  }
  console.log(`Failed task [${err?.status ?? 'unknown'}]: ${err?.message ?? e}`);
}

async function runWorkerPool(source: AsyncIterable<() => Promise<void>>) {
  const iterator = source[Symbol.asyncIterator]();
  let rateLimited = false;
  let tasksDone = 0;

  const stop = () => {
    rateLimited = true;
  };

  async function worker() {
    while (!rateLimited) {
      let next: IteratorResult<() => Promise<void>>;
      try {
        next = await iterator.next();
      } catch (e) {
        handleTaskError(e, stop);
        return;
      }
      if (next.done) return;
      try {
        await next.value();
      } catch (e) {
        handleTaskError(e, stop);
      } finally {
        tasksDone++;
        console.log(`Task ${tasksDone} done.`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log('Async job completed.');
}

export function createAsyncTaskApi(getAsyncTasks: AsyncTaskSource) {
  let running = false;
  return async (event: RequestEvent) => {
    new AdminRequestValidator(event).validate();
    if (running) error(429, 'limit');
    running = true;

    runWorkerPool(getAsyncTasks())
      .catch((e) => console.error('Sync job failed:', e))
      .finally(() => {
        running = false;
      });

    return new Response('Sync started');
  };
}
