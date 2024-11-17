import { logout } from '$lib/server/auth/services';
import type { RequestEvent, RequestHandler } from './$types';

export const DELETE: RequestHandler = function (event: RequestEvent) {
  logout(event.cookies);
  return new Response();
};
