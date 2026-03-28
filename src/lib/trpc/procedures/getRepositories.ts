import * as middlewares from '../middlewares/auth';
import { t } from '../t';
import { getGithubRepositories } from '$lib/server/github/services';
import { searchPlugins } from '$lib/server/prisma/neovimplugins/service';

export const getRepositories = t.procedure
  .use(middlewares.isAuthenticated)
  .query(async ({ ctx }) => {
    const user = ctx.getAuthenticatedUser();
    const plugins = await searchPlugins();
    const pluginNamesArr = plugins.data
      .filter((p) => p.category !== 'preconfigured')
      .map((p) => p.name);
    const pluginNames = new Set(pluginNamesArr);
    pluginNames.delete('vim');
    pluginNames.delete('nvim');
    pluginNames.delete('neovim');
    return (await getGithubRepositories(user)).filter((r) => !pluginNames.has(r.name));
  });
