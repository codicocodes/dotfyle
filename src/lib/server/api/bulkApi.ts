import { AdminRequestValidator } from '$lib/server/api/AdminRequestValidator';
import { error, type RequestEvent } from '@sveltejs/kit';

type AsyncTaskSource = () => AsyncIterable<() => Promise<void>>;

const CONCURRENCY = 10;

async function runWorkerPool(jobName: string, source: AsyncIterable<() => Promise<void>>) {
  const iterator = source[Symbol.asyncIterator]();
  let rateLimited = false;
  let tasksCompleted = 0;
  let tasksSucceeded = 0;
  let tasksFailed = 0;

  const stop = () => {
    rateLimited = true;
  };

  function handleTaskError(e: unknown) {
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
      console.log(
        `[${jobName}] Rate limited (limit: ${err.rateLimitLimit ?? 'unknown'}). Resets at: ${reset}`
      );
      console.log(
        `[${jobName}] Job Stopped Early. [COMPLETED] ${tasksCompleted} [SUCCESS] ${tasksSucceeded} [FAILURE] ${tasksFailed}`
      );
      throw e;
    }
    console.log(
      `[${jobName}] Task [${tasksCompleted}] FAILED. [${err?.status ?? 'unknown'}]: ${err?.message ?? e}`
    );
  }

  async function worker() {
    while (!rateLimited) {
      let next: IteratorResult<() => Promise<void>>;
      try {
        next = await iterator.next();
      } catch (e) {
        handleTaskError(e);
        return;
      }
      if (next.done) return;
      try {
        tasksCompleted++;
        await next.value();
        tasksSucceeded++;
        console.log(`[${jobName}] Task [${tasksCompleted}] SUCCESS.`);
      } catch (e) {
        tasksFailed++;
        handleTaskError(e);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(
    `[${jobName}] Job Completed. [COMPLETED] ${tasksCompleted} [SUCCESS] ${tasksSucceeded} [FAILURE] ${tasksFailed}`
  );
}

export function createAsyncTaskApi(jobName: string, getAsyncTasks: AsyncTaskSource) {
  let running = false;
  return async (event: RequestEvent) => {
    new AdminRequestValidator(event).validate();
    if (running) error(429, 'limit');
    running = true;

    runWorkerPool(jobName, getAsyncTasks())
      .catch((e) => console.error('Sync job failed:', e))
      .finally(() => {
        running = false;
      });

    return new Response('Sync started');
  };
}
