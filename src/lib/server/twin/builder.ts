import { prismaClient } from '../prisma/client';
import { readFileSync } from 'fs';
import { daysAgo, getMediaType } from '$lib/utils';
import type { Media, NeovimPlugin } from '@prisma/client';
import { getRecentCoreCommits } from './getRecentCoreCommits';

export class IssueAlreadyPublished extends Error {
	constructor() {
		const message = 'This issue has already been published';
		super(message);
	}
}

interface ContentFetcher {
	section: string;
	getContent(days: number): Promise<string>;
}

class CoreCommitContentFetcher implements ContentFetcher {
	section = '{neovim-core-commits-section}';
	template = './twin/core-commit-template.md';
	async getContent(days: number) {
		const newCoreCommitTemplate = readFileSync(this.template, 'utf8');
		const commits = await getRecentCoreCommits();

		const content = []
		for (const commit of commits) {
			if (daysAgo(days) < commit.date) {
				let commitContent = newCoreCommitTemplate
				commitContent = commitContent.replaceAll('{title}', commit.title);
				commitContent = commitContent.replaceAll('{body}', commit.body);
				commitContent = commitContent.replaceAll('{url}', commit.url);
				content.push(commitContent)
			}
		}
		return content.join('');
	}
}

export class TwinPostBuilder {
	newPluginTemplate = './twin/new-plugin-template.md';
	template = './twin/template.md';
	contentFetchers: ContentFetcher[] = [new CoreCommitContentFetcher()];

	async validate(issue: number) {
		const twinIssue = await prismaClient.twinPost.findUnique({
			where: {
				issue
			}
		});
		if (!twinIssue) return;
		if (!twinIssue.publishedAt) return;
		throw new IssueAlreadyPublished();
	}

	async run(issue: number, days: number) {
		const newPlugins = await this.getNewPlugins(days);
		let content = await this.appendNewPlugins(newPlugins);

		for (const contentFetcher of this.contentFetchers) {
			content = content.replace(contentFetcher.section, await contentFetcher.getContent(days));
		}
		const title = `Issue #${issue}: ${newPlugins
			.map((p) => p.name)
			.slice(0, 3)
			.join(', ')}`;
		const post = {
			title,
			content,
			issue,
			publishedAt: null
		};
		return await prismaClient.twinPost.upsert({
			where: {
				issue
			},
			create: post,
			update: post
		});
	}

	async getNewPlugins(days: number) {
		const plugins = await prismaClient.neovimPlugin.findMany({
			include: {
				media: true
			},
			where: {
				createdAt: {
					gte: daysAgo(days)
				},
				stars: {
					lt: 200
				}
			},
			orderBy: {
				neovimConfigPlugins: {
					_count: 'desc'
				}
			}
		});
		return plugins;
	}

	async getCoreCommitsContent() { }

	async appendNewPlugins(plugins: (NeovimPlugin & { media: Media[] })[]) {
		const template = readFileSync(this.template, 'utf8');

		const newPluginTemplate = readFileSync(this.newPluginTemplate, 'utf8');

		const newPlugins = [];

		for (const plugin of plugins) {
			let post = newPluginTemplate.replaceAll('{fullname}', `${plugin.owner}/${plugin.name}`);
			post = post.replaceAll(
				'{image}',
				plugin.media.filter((m) => getMediaType(m) === 'image')[0]?.url ?? ''
			);
			post = post.replaceAll('{category}', plugin.category);
			post = post.replaceAll('{description}', plugin.shortDescription);
			post = post.replaceAll('{githubUrl}', `https://github.com/${plugin.owner}/${plugin.name}`);
			post = post.replaceAll('{dotfyleUrl}', `/plugins/${plugin.owner}/${plugin.name}`);
			newPlugins.push(post);
		}

		return template.replaceAll('{new-plugins-section}', newPlugins.join('\n\n'));
	}
}
