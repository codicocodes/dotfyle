import { z } from "zod";

export const GithubProfileDTO = z.object({
	id: z.number(),
	login: z.string(),
	avatar_url: z.string()
});

export type GithubProfileDTO = z.infer<typeof GithubProfileDTO>;
