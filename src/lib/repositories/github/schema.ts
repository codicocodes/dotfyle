import { z } from "zod";

export const GithubRepository = z.object({
	id: z.number(),
	name: z.string(),
	html_url: z.string(),
  fork: z.boolean(),
	stargazers_count: z.number(),
	size: z.number(),
	language: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
});

export type GithubRepository = z.infer<typeof GithubRepository>;
