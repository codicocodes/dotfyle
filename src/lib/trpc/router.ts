import { getGithubRepositories, getRepoFileTree } from '$lib/repositories/github/services';
import { NvimGithubSyncManager } from '$lib/nvim-sync/services/sync-manager';
import { isAuthenticated } from './middlewares/auth';
import { t } from './t';
import { z } from 'zod';
import delay from 'delay';
import { InitFileFinder } from '$lib/nvim-sync/services/init-file-finder';

export const router = t.router({
	getUser: t.procedure.query(async ({ ctx }) => {
		return ctx.user;
	}),
	getRepositories: t.procedure.use(isAuthenticated).query(async ({ ctx }) => {
    return getGithubRepositories(ctx.user!);
	}),
	syncRepository: t.procedure.use(isAuthenticated).input((input: unknown) => {
    return z.object({repo: z.string()}).parse(input)
  }).query(async ({ ctx, input }) => {
    // const syncManager = new NvimGithubSyncManager(ctx.user!)
    // return syncManager.sync(input.repo)
    await delay(10000)
    return {}
	}),
  findRepoInitFiles: t.procedure.use(isAuthenticated).input((input: unknown) => {
    return z.object({repo: z.string()}).parse(input)
  }).query(async ({ ctx, input }) => {
    ctx.user!.username = 'creativenull'
    const root = await getRepoFileTree(ctx.user!, input.repo)
    const initFiles = new InitFileFinder().findAllInitFile(root)
    return initFiles
	}),
});

export type Router = typeof router;
