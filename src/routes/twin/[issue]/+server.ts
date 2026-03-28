import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = (event) => {
  const issue = event.params.issue;
  redirect(302, `/this-week-in-neovim/${issue}`);
};
