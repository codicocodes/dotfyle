import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
	githubLogin: async () => {
		throw redirect(303, '/api/auth/github');
	}
};
