import { t } from '../../t';
import { getAllPluginCategories } from '$lib/server/prisma/neovimplugins/service';

export const listPluginCategories = t.procedure.query(async () => {
  return getAllPluginCategories();
});
