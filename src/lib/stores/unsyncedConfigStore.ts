import type { NeovimPlugin, NeovimPluginManager } from '@prisma/client';
import { writable } from 'svelte/store';

export interface UnsyncedConfig {
	owner?: string;
	repo?: string;
	root?: string;
	initFile?: string;
	branch?: string;
	fork?: boolean;
	stars?: number;
	pluginManager: NeovimPluginManager | null;
	plugins?: NeovimPlugin[];
}

export const unsyncedConfig = writable<UnsyncedConfig>({
	owner: undefined,
	repo: undefined,
	root: undefined,
	initFile: undefined,
	branch: undefined,
	fork: undefined,
	stars: undefined,
	pluginManager: null,
	plugins: undefined
});

async function syncSelectedRepository(config: UnsyncedConfig) {
	if (
		!config.repo ||
		!config.initFile ||
		!config.root ||
		!config.branch
	) {
		return;
	}
	const syncedConfig = await trpc($page)
		.syncRepository.query({
			repo: config.repo,
			initFile: config.initFile as InitFileNames,
			root: config.root,
			branch: config.branch
		})
		.catch((e) => {
			console.log(e);
			throw e;
		});
	unsyncedConfig.update((c) => ({
		...c,
		pluginManager: syncedConfig.pluginManager,
		plugins: syncedConfig.plugins as unknown as NeovimPlugin[]
	}));
}
