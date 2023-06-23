import { AdminRequestValidator } from '$lib/server/api/AdminRequestValidator';
import { syncWeeklyTrending } from '$lib/server/prisma/neovimplugins/service';
import type { RequestHandler } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const GET: RequestHandler = async (event: RequestEvent) => {
  new AdminRequestValidator(event).validate();
  await syncWeeklyTrending();
  return new Response("Weekly trending plugins has been recalculated")
}
