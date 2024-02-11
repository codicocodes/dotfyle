import { refreshToken, verifyToken } from '$lib/server/auth/services';
import type { RequestEvent, RequestHandler } from './$types';

export const POST: RequestHandler = function (event: RequestEvent) {
	const user = verifyToken(event.cookies);
	if (user) {
		refreshToken(event.cookies, user);
	}
	return new Response();
};
