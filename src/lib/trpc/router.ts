import { getGithubRepositories } from '$lib/repositories/github/services';
import delay from 'delay';
import { isAuthenticated } from './middlewares/auth';
import { t } from './t';

export const router = t.router({
	getUser: t.procedure.query(async ({ ctx }) => {
		return ctx.user;
	}),
	getRepositories: t.procedure.use(isAuthenticated).query(async ({ ctx }) => {
    return getGithubRepositories(ctx.user);
	}),
	syncRepository: t.procedure.use(isAuthenticated).query(async ({ ctx }) => {
    await delay(10000)
    return {}
	})
});

export type Router = typeof router;
