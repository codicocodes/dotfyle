import type { NeovimConfigSync } from '@prisma/client';

export type FormattedNeovimConfigSync = NeovimConfigSync & {
	syncedLanguageServers: string[];
	syncedPlugins: string[];
};
