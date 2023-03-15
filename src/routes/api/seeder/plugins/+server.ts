import { upsertManyNeovimPlugins } from "$lib/prisma/neovimplugins/service";
import { scrapeRockerBooAwesomeNeovim } from "$lib/seeder/plugins";
import type { RequestEvent, RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async function (event: RequestEvent) {
  const plugins = await scrapeRockerBooAwesomeNeovim()
  const saved = await upsertManyNeovimPlugins(plugins)
  const res = new Response(
      JSON.stringify(saved, undefined, 4)
  )
  return res;
};
