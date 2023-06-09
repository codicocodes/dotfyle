import { trpc } from '$lib/trpc/client';
import { error, redirect } from '@sveltejs/kit';
import type { ActionData, PageServerLoad, PageServerLoadEvent } from './$types';
import { z } from 'zod';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
	const issueStr = event.params.issue;
  if (isNaN(Number(issueStr))) {
    throw error(404)
  }
  const issue = parseInt(issueStr, 10)
	const post = await trpc(event).getTwinByIssue.query({ issue }).catch(() => {
    throw error(404)
  })
  const cleanHtml =  remark().use(remarkHtml).processSync(post.content).toString();
	return { 
    post: {
      ...post,
      cleanHtml
    },
    seo: {
      title: `This Week in Neovim ${post.title}`
    }
  };
};

export const actions = {
	default: async (event: ActionData) => {
		const data = await event.request.formData();
		const issue = Number(data.get('issue'));
		const days = Number(data.get('days'));
		const input = z.object({ days: z.number(), issue: z.number() }).parse({ days, issue });
		const post = await trpc(event).generateTwinIssue.query(input);
    throw redirect(302, `/this-week-in-neovim/${post.issue}/edit`)
	}
};
