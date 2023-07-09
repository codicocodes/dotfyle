import { trpc } from "$lib/trpc/client";
import type { PageLoad, PageLoadEvent } from "./$types";

export const load: PageLoad = async function load(event: PageLoadEvent) {
  const pageStr = event.url.searchParams.get('page') ?? '1'
  const pageNum = parseInt(pageStr, 10)
  const page = isNaN(pageNum) ? 1 : pageNum
  const res = await trpc(event).getTwinPosts.query({ page, size: 10 })
  return {
    posts: res.data,
    pagination: res.meta,
  };
};
