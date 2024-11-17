import type { NeovimPlugin, NeovimPluginManager } from '@prisma/client';
import { writable } from 'svelte/store';

export interface UnsyncedConfig {
  owner?: string;
  repo?: string;
  root?: string;
  initFile?: string;
  slug?: string;
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
