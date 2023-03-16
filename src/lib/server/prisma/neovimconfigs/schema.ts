import { z } from 'zod';
import { InitFileNames } from '../../nvim-sync/services/init-file-finder';
import type { NeovimConfig, NeovimConfigPlugins, NeovimPlugin } from '@prisma/client';

export const CreateNeovimConfigDTO = z.object({
	githubId: z.number(),
	stars: z.number(),
	owner: z.string(),
	repo: z.string(),
	root: z.string(),
	branch: z.string(),
	fork: z.boolean(),
	initFile: z.nativeEnum(InitFileNames)
});

export type CreateNeovimConfigDTO = z.infer<typeof CreateNeovimConfigDTO>;

export type NestedNeovimConfigWithPlugins = NeovimConfig & {
    neovimConfigPlugins: (NeovimConfigPlugins & {
        plugin: NeovimPlugin;
    })[];
}

export interface NeovimConfigWithPlugins extends NeovimConfig {
  plugins: NeovimPlugin[];
}
