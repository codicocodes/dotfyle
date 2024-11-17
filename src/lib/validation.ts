import { z } from 'zod';

export const GithubRepository = z.object({
  id: z.number(),
  owner: z.object({
    login: z.string()
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
  updated_at: z.string(),
  topics: z.optional(z.array(z.string()))
});

export const NeovimPluginRepositorySchema = GithubRepository.extend({
  language: z.literal('Lua', {
    errorMap: () => ({ message: 'The repository is not written in Lua' })
  }),
  topics: z
    .string({ errorMap: () => ({ message: '' }) })
    .array()
    .refine(
      (val) => {
        const neovimPlugin = val.some((t) => t === 'neovim-plugin');
        const neovim = val.some((t) => t === 'neovim');
        const plugin = val.some((t) => t === 'plugin');
        return neovimPlugin || (neovim && plugin);
      },
      {
        message: "The repository is not tagged as 'neovim-plugin' on GitHub"
      }
    )
});

export function validateRepositoryDataIsNeovimPlugin(data: z.infer<typeof GithubRepository>) {
  return NeovimPluginRepositorySchema.parse(data);
}
