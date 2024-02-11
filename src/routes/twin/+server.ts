import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () => {
	throw redirect(302, '/this-week-in-neovim');
};
