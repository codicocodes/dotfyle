import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async function load() {
	throw redirect(301, '/neovim/plugins/trending');
};
