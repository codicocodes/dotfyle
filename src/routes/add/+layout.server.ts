import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad, LayoutServerLoadEvent } from './$types';

export const load: LayoutServerLoad = async function load(e: LayoutServerLoadEvent) {
	const { user } = await e.parent();
	if (!user) {
		throw redirect(303, '/');
	}
	return {
		user
	};
};
