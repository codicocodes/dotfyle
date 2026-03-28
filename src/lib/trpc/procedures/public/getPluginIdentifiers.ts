import { t } from '../../t';
import { getAllNeovimPluginNames } from '$lib/server/prisma/neovimplugins/service';

export const getPluginIdentifiers = t.procedure.query(async () => {
  return getAllNeovimPluginNames();
});
