import { z } from 'zod';
import type { NeovimConfig, NeovimConfigPlugins, NeovimPlugin } from '@prisma/client';

export const CreateNeovimConfigDTO = z.object({
	githubId: z.number(),
	stars: z.number(),
	owner: z.string(),
  slug: z.string(),
	repo: z.string(),
	root: z.string(),
	branch: z.string(),
	fork: z.boolean(),
	initFile: z.string()
});

export type CreateNeovimConfigDTO = z.infer<typeof CreateNeovimConfigDTO>;

export type NestedNeovimConfigWithPlugins = NeovimConfig & {
    neovimConfigPlugins: (NeovimConfigPlugins & {
        plugin: NeovimPlugin;
    })[];
}

export type NestedNeovimConfigWithMetaData = NeovimConfig & {
  user: {
    avatarUrl: string;
  };
  _count: {
    neovimConfigPlugins: number;
  };
}

export interface NeovimConfigWithPlugins extends NeovimConfig {
  plugins: NeovimPlugin[];
}


export interface NeovimConfigWithMetaData extends NeovimConfig {
  ownerAvatar: string;
  pluginCount: number;
}
