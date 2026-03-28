import { t } from '../../t';
import * as NeovimPluginService from '$lib/server/prisma/neovimplugins/service';

export const getPopularPlugins = t.procedure.query(async () => {
  return NeovimPluginService.getPopularPlugins();
});
