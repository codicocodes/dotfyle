
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = (event) => {
	const { year, month, day } = event.params;
  console.log({ year, month, day})
	throw redirect(302, `/twin/${year}/${month}/${day}`);
};
