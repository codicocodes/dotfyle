import { isAuthenticated } from './middlewares/auth';
import { t } from './t';
import { z } from 'zod';
import { getGithubRepositories, getRepoFileTree } from '$lib/server/github/services';
import { InitFileFinder, InitFileNames } from '$lib/server/nvim-sync/services/init-file-finder';
import { getGithubToken, getUserByUsername } from '$lib/server/prisma/users/service';
import { fetchRepoFileTree } from '$lib/server/github/api';
import { syncRepoInfo, validateConfigPath } from '$lib/server/nvim-sync/services/sync-repo-info';
import { syncManagerFactory } from '$lib/server/nvim-sync/services/SyncManager';
import {
	getConfigBySlug,
	getConfigsByUsername,
	getConfigsForPlugin,
	getNewestNeovimConfigs
} from '$lib/server/prisma/neovimconfigs/service';
import {
	getPlugin,
	getPluginsByCategory,
	getPluginsBySlug,
	getPopularPlugins
} from '$lib/server/prisma/neovimplugins/service';
import { getPluginSyncer } from '$lib/server/sync/plugins/sync';

export const router = t.router({
	syncPlugin: t.procedure
		.input((input: unknown) => {
			return z
				.object({
					owner: z.string(),
					name: z.string()
				})
				.parse(input);
		})
		.query(async ({ input: { owner, name }, ctx }) => {
      const user = ctx.getAuthenticatedUser()
			const syncer = await getPluginSyncer(user.id, owner, name);
			return syncer.sync();
		}),
	getPluginsByCategory: t.procedure
		.input((input: unknown) => {
			return z.string().parse(input);
		})
		.query(async ({ input: category }) => {
			return getPluginsByCategory(category);
		}),
	getPopularPlugins: t.procedure.query(async () => {
		return getPopularPlugins();
	}),
	getConfigsForPlugin: t.procedure
		.input((input: unknown) => {
			return z
				.object({
					owner: z.string(),
					name: z.string()
				})
				.parse(input);
		})
		.query(async ({ input: { owner, name } }) => {
			return getConfigsForPlugin(owner, name);
		}),
	getPlugin: t.procedure
		.input((input: unknown) => {
			return z
				.object({
					owner: z.string(),
					name: z.string()
				})
				.parse(input);
		})
		.query(async ({ input: { owner, name } }) => {
			return getPlugin(owner, name);
		}),
	getPluginsBySlug: t.procedure
		.input((input: unknown) => {
			return z
				.object({
					username: z.string(),
					slug: z.string()
				})
				.parse(input);
		})
		.query(async ({ input: { username, slug } }) => {
			return getPluginsBySlug(username, slug);
		}),
	getConfigBySlug: t.procedure
		.input((input: unknown) => {
			return z
				.object({
					username: z.string(),
					slug: z.string()
				})
				.parse(input);
		})
		.query(async ({ input: { username, slug } }) => {
			return getConfigBySlug(username, slug);
		}),
	getConfigsByUsername: t.procedure
		.input((input: unknown) => {
			return z.string().parse(input);
		})
		.query(async ({ input: username }) => {
			return getConfigsByUsername(username);
		}),
	getUserByUsername: t.procedure
		.input((input: unknown) => {
			return z.string().parse(input);
		})
		.query(async ({ input: username }) => {
			return getUserByUsername(username);
		}),
	getUser: t.procedure.query(async ({ ctx }) => {
		return ctx.user;
	}),
	getRepositories: t.procedure.use(isAuthenticated).query(async ({ ctx }) => {
		const user = ctx.getAuthenticatedUser();
		return getGithubRepositories(user);
	}),
	getNewestConfigs: t.procedure.query(async () => {
		const configs = await getNewestNeovimConfigs();
		return configs;
	}),
	createNeovimConfig: t.procedure
		.use(isAuthenticated)
		.input((input: unknown) => {
			return z
				.object({
					initFile: z.nativeEnum(InitFileNames),
					root: z.string(),
					repo: z.string(),
					branch: z.string()
				})
				.parse(input);
		})
		.query(async ({ ctx, input }) => {
			const user = ctx.getAuthenticatedUser();
			const token = await getGithubToken(user.id);
			const tree = await fetchRepoFileTree(token, user.username, input.repo, input.branch);
			validateConfigPath(tree, input.root ? `${input.root}/${input.initFile}` : input.initFile);
			const config = await syncRepoInfo(
				user,
				user.username,
				input.repo,
				input.root,
				input.initFile
			);
			const syncer = await syncManagerFactory(user, config);
			return await syncer.treeSync();
		}),
	findRepoInitFiles: t.procedure
		.use(isAuthenticated)
		.input((input: unknown) => {
			return z.object({ repo: z.string(), branch: z.string() }).parse(input);
		})
		.query(async ({ ctx, input }) => {
			const user = ctx.getAuthenticatedUser();
			const root = await getRepoFileTree(user, input.repo, input.branch);
			const initFiles = new InitFileFinder().findAllInitFile(root);
			return initFiles;
		})
});

export type Router = typeof router;
