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
};

export type NestedNeovimConfigWithMetaData = NeovimConfig & {
  syncs?: { sha: string }[];
  user: {
    avatarUrl: string;
  };
  _count: {
    neovimConfigPlugins: number;
  };
  neovimConfigPlugins?: {
    paths: string;
  }[];
};
export type NestedNeovimConfigWithToken = NeovimConfig & {
  user: {
    githubToken:
      | {
          accessToken: string;
        }
      | undefined;
  };
};

export interface NeovimConfigWithToken extends NeovimConfig {
  _token: string;
}

export interface NeovimConfigWithPlugins extends NeovimConfig {
  plugins: NeovimPlugin[];
}

export interface NeovimConfigWithMetaData extends NeovimConfig {
  ownerAvatar: string;
  pluginCount: number;
  sha: string | null;
  paths: string[] | undefined;
}
