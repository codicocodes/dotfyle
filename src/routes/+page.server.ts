import { redirect, type Actions } from "@sveltejs/kit";
import { trpc } from '$lib/trpc/client';
import type { NeovimConfig } from '$lib/types';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const actions: Actions = {
	githubLogin: async () => {
		throw redirect(303, '/api/auth/github');
	}
};

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
	const codiConfig = {
		stars: 69,
		owner: 'codicocodes',
		ownerAvatar: 'https://avatars.githubusercontent.com/u/76068197?v=4',
		name: 'dotfiles',
		path: '/nvim',
		language: 'lua',
		pluginManager: 'packer.nvim',
		plugins: 420
	} as NeovimConfig;

	const configs: NeovimConfig[] = new Array(10).fill(codiConfig);

  return {
    user: await trpc(event).getUser.query(),
    configs,
  };
}
