import { t } from '../../t';
import { getNewestNeovimConfigs } from '$lib/server/prisma/neovimconfigs/service';

export const getNewestConfigs = t.procedure.query(async () => {
  const configs = await getNewestNeovimConfigs();
  return configs;
});
