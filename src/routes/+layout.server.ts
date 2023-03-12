import { page } from '$app/stores';
import { trpc } from '$lib/trpc/client';
import type { NeovimConfig } from '$lib/types';
import type { LayoutServerLoadEvent } from './$types';
/** @type {import('./$types').LayoutServerLoad} */
export async function load(event: LayoutServerLoadEvent) {
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
