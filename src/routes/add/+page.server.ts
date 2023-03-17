import { trpc } from '$lib/trpc/client';
import type { User } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
	try {
		const [user, repositories] = await Promise.all([
			trpc(event).getUser.query(),
			trpc(event).getRepositories.query()
		]);
		if (!user) {
			throw redirect(303, '/');
		}
		return {
			user: user as unknown as User,
			repositories,
		};
	} catch (e) {
		throw redirect(303, '/');
	}
};
