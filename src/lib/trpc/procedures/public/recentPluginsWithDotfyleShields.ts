import { t } from '../../t';
import { getPluginsWithDotfyleShield } from '$lib/server/prisma/neovimplugins/service';

export const recentPluginsWithDotfyleShields = t.procedure.query(() => {
  return getPluginsWithDotfyleShield();
});
