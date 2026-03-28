import { z } from 'zod';
import * as middlewares from '../middlewares/auth';
import { t } from '../t';
import { getGithubToken } from '$lib/server/prisma/users/service';
import { fetchGithubRepositoryByName } from '$lib/server/github/api';
import { upsertNeovimPlugin } from '$lib/server/prisma/neovimplugins/service';
import { isAdmin } from '$lib/utils';
import { validateRepositoryDataIsNeovimPlugin } from '$lib/validation';
import { PluginDTO } from '$lib/server/prisma/neovimplugins/schema';
import { PluginSyncer } from '$lib/server/sync/plugins/sync';

export const createNeovimPlugin = t.procedure
  .use(middlewares.isAuthenticated)
  .input((input: unknown) => {
    // TODO: when making this public we can not just use any string for category
    // we have to validate that it is a category currently in se
    return z
      .object({
        owner: z.string(),
        name: z.string(),
        category: z.string()
      })
      .parse(input);
  })
  .mutation(async ({ input: { owner, name, category }, ctx }) => {
    const token = await getGithubToken(ctx.user!.id);
    const repository = await fetchGithubRepositoryByName(token, owner, name);
    if (!isAdmin(ctx!.user)) {
      validateRepositoryDataIsNeovimPlugin(repository);
    }
    const pluginDTO = {
      type: 'github',
      source: 'manually-created',
      category,
      link: repository.html_url,
      owner,
      name,
      shortDescription: repository.description ?? ''
    };
    const plugin = await upsertNeovimPlugin(PluginDTO.parse(pluginDTO));
    return new PluginSyncer(token, {
      ...plugin,
      configCount: 0,
      media: []
    }).sync();
  });
