import { trpc } from '$lib/trpc/client';
import { error, redirect } from '@sveltejs/kit';
import type { Action } from './$types';

export const actions: Action = {
	update: async (event: any) => {
		const issueStr = event.params.issue;
		if (isNaN(Number(issueStr))) {
			throw error(404);
		}
		const issue = parseInt(issueStr, 10);
		const data = await event.request.formData();
		const content = data.get('content');
		const title = data.get('title');
		const post = await trpc(event).updateTwinIssue.query({
			content,
			title,
			issue
		});
		return post;
	},
	publish: async (event: any) => {
		const issueStr = event.params.issue;
		if (isNaN(Number(issueStr))) {
			throw error(404);
		}
		const issue = parseInt(issueStr, 10);
		const post = await trpc(event).publishTwinIssue.query({
			issue
		});
		console.log('test');
		throw redirect(302, `/this-week-in-neovim/${post.issue}`);
	}
};
