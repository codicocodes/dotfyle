import { z } from 'zod';

export const RedditListingSchema = z.object({
  data: z.object({
    children: z.array(
      z.object({
        data: z.object({
          selftext: z.string(),
          title: z.string(),
          url: z.string()
        })
      })
    )
  })
});

export async function fetchNewRedditPosts() {
  const URL = 'https://www.reddit.com/r/neovim/new.json';
  const rawRedditPostData = (await fetch(URL).then((r) => {
    const remaining = Number(r.headers.get('x-ratelimit-remaining'));
    const used = Number(r.headers.get('x-ratelimit-used'));
    const reset = Number(r.headers.get('x-ratelimit-reset'));
    const rateLimit = { remaining, used, reset };
    console.log(rateLimit);
    return r.json();
  })) as unknown;
  const redditPosts = RedditListingSchema.parse(rawRedditPostData);
  return redditPosts.data.children.map((c) => c.data);
}
