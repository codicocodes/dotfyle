import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () => {
  redirect(302, '/this-week-in-neovim');
};
