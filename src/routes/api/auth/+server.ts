
import { logout } from '$lib/auth/services';
import type { RequestEvent, RequestHandler } from './$types';

export const DELETE: RequestHandler = function(event: RequestEvent) {
  logout(event.cookies)
  return new Response()
};
