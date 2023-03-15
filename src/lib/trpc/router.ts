import { isAuthenticated } from './middlewares/auth';
import { t } from './t';
import { z } from 'zod';
import { InitFileFinder, InitFileNames } from '$lib/nvim-sync/services/init-file-finder';
import { syncRepoInfo, validateConfigPath } from '$lib/nvim-sync/services/sync-repo-info';
import { getGithubToken } from '$lib/prisma/users/service';
import { fetchRepoFileTree } from '$lib/github/api';
import { getGithubRepositories, getRepoFileTree } from '$lib/github/services';
import { syncManagerFactory } from '$lib/nvim-sync/services/SyncManager';
import { getConfigWithPlugins } from '$lib/prisma/neovimconfigs/service';

export const router = t.router({
	getUser: t.procedure.query(async ({ ctx }) => {
		return ctx.user;
	}),
	getRepositories: t.procedure.use(isAuthenticated).query(async ({ ctx }) => {
    const user = ctx.getAuthenticatedUser()
		return getGithubRepositories(user);
	}),
	syncRepository: t.procedure
		.use(isAuthenticated)
		.input((input: unknown) => {
			return z.object({ 
        initFile: z.nativeEnum(InitFileNames),
        root: z.string(),
        repo: z.string(),
        branch: z.string(),
      }).parse(input);
		})
    .query(async ({ ctx, input }) => {
      const user = ctx.getAuthenticatedUser()
      const token = await getGithubToken(user.id)
      console.log({input})
      const tree = await fetchRepoFileTree(token, user.username, input.repo, input.branch)
      validateConfigPath(tree, input.root ? `${input.root}/${input.initFile}`: input.initFile)
      const config = await syncRepoInfo(user, user.username, input.repo, input.root, input.initFile)
      const syncer = await syncManagerFactory(user, config)
      await syncer.treeSync()
      return syncer.config
      // const configWithPlugins = await getConfigWithPlugins(config.id)
      // return configWithPlugins
    }),
	findRepoInitFiles: t.procedure
		.use(isAuthenticated)
		.input((input: unknown) => {
			return z.object({ repo: z.string(), branch: z.string() }).parse(input);
		})
		.query(async ({ ctx, input }) => {
      const user = ctx.getAuthenticatedUser()
			const root = await getRepoFileTree(user, input.repo, input.branch);
			const initFiles = new InitFileFinder().findAllInitFile(root);
			return initFiles;
		})
});

export type Router = typeof router;
