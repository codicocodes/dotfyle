import { t } from '../../t';
import { prismaClient } from '$lib/server/prisma/client';

export const getDotfyleStatisitics = t.procedure.query(async () => {
  const installsP = prismaClient.neovimConfigPlugins.count();
  const usersP = prismaClient.user.count();
  const pluginsP = prismaClient.neovimPlugin.count();
  const [installs, users, plugins] = await Promise.all([installsP, usersP, pluginsP]);
  return {
    installs,
    users,
    plugins
  };
});
