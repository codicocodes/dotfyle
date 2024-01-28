import { trpc } from '$lib/trpc/client';
import { error } from '@sveltejs/kit';
import type { PageLoad, PageLoadEvent } from './$types';
import { sanitizeHtml } from '$lib/utils';
import { marked } from 'marked';

export const load: PageLoad = async function load(event: PageLoadEvent) {
	const issueStr = event.params.issue;
	if (isNaN(Number(issueStr))) {
		throw error(404);
	}
	const issue = parseInt(issueStr, 10);
	const post = await trpc(event)
		.getTwinByIssue.query({ issue })
		.catch(() => {
			throw error(404);
		});
	const renderer = new marked.Renderer();
	const linkRenderer = renderer.link;
	renderer.link = (href: string, title: string, text: string) => {
		const localLink = href.startsWith('https://dotfyle.com') || href.startsWith('/');
		const html = linkRenderer.call(renderer, href, title, text);
		return localLink
			? html.replace(/^<a /, `<a target="_blank"`)
			: html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `);
	};
	const headingRenderer = renderer.heading;
	renderer.heading = (text, level, raw, slugger) => {
		const heading = headingRenderer.call(renderer, text, level, raw, slugger);
		const id = `user-content-${text
			.toLowerCase()
			.replaceAll('/', '')
			.replaceAll('.', '')
			.replaceAll(' ', '-')}`;
		const anchorHeading = `<a href="#${id}">${heading}</a>`;
		return anchorHeading;
	};

	const cleanHtml = await sanitizeHtml(marked(post.content, { renderer }));

	return {
		post: {
			...post,
			cleanHtml
		},
		seo: {
			title: `This Week in Neovim: ${post.title} | Neovim news`
		}
	};
};
