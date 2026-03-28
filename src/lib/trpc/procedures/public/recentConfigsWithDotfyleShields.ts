import { t } from '../../t';
import { getNeovimConfigsWithDotfyleShield } from '$lib/server/prisma/neovimconfigs/service';

export const recentConfigsWithDotfyleShields = t.procedure.query(() => {
  return getNeovimConfigsWithDotfyleShield();
});
