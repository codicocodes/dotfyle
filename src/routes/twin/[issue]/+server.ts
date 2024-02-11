import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = (event) => {
	const issue = event.params.issue;
	throw redirect(302, `/this-week-in-neovim/${issue}`);
};
