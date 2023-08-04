import type { Media, NeovimPlugin } from '@prisma/client';
import { z } from "zod";

export const PluginDTO = z.object({
	type: z.enum(['github']),
	source: z.enum(['awesome-neovim', 'submitted-plugins']),
	category: z.string(),
	link: z.string(),
	owner: z.string(),
	name: z.string(),
	shortDescription: z.string()
});

export type PluginDTO = z.infer<typeof PluginDTO>;

export interface NeovimPluginIdentifier {
  id: number;
  owner: string;
  name: string
}


export type NestedNeovimPluginWithCount = NeovimPlugin & {
    _count: {
        neovimConfigPlugins: number;
    };
}

export type NeovimPluginWithCount = NeovimPlugin & {
  configCount: number
  media: Media[]
}
