import { z } from 'zod';

export const GithubRepository = z.object({
	id: z.number(),
	owner: z.object({
    login: z.string(),
  }),
	name: z.string(),
	description: z.string().nullable(),
	html_url: z.string(),
	fork: z.boolean(),
	stargazers_count: z.number(),
	size: z.number(),
	language: z.string().nullable(),
	default_branch: z.string(),
	created_at: z.string(),
	updated_at: z.string()
});

export type GithubRepository = z.infer<typeof GithubRepository>;

export const GithubNode = z.object({
	path: z.string().optional(),
	mode: z.string().optional(),
	type: z.string().optional(),
	sha: z.string().optional(),
	size: z.number().optional(),
	url: z.string().optional()
});

export type GithubNode = z.infer<typeof GithubNode>;

export const GithubTree = z.object({
	sha: z.string(),
	url: z.string(),
	truncated: z.boolean(),
	tree: z.array(GithubNode)
});

export type GithubTree = z.infer<typeof GithubTree>;

export const GithubBlob = z.object({
	content: z.string()
});

export type GithubBlob= z.infer<typeof GithubBlob>;
