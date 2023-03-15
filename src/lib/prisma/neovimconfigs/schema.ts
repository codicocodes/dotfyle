import { z } from 'zod';
import { InitFileNames } from '../../nvim-sync/services/init-file-finder';

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
