import RSS from 'rss';
import { prismaClient } from '$lib/server/prisma/client';
import { marked } from 'marked';
import { getMediaType, sanitizeHtml } from '$lib/utils';
import fs from 'fs';

export async function createPluginsRssFeed() {
	const feed = new RSS({
		title: 'New Neovim Plugins',
		description: 'The newest Neovim plugins on Dotfyle',
		site_url: 'https://dotfyle.com/neovim/plugins/new',
		feed_url: 'https://dotfyle.com/neovim/plugins/rss.xml'
	});
	const plugins = await prismaClient.neovimPlugin.findMany({
		include: {
			media: {
				orderBy: {
					thumbnail: 'desc'
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		},
		take: 10
	});

	const template = fs.readFileSync('./templates/plugin.md', 'utf8');

	for (const plugin of plugins) {
		const title = `${plugin.owner}/${plugin.name}`;
		const image = plugin.media.filter((m) => getMediaType(m) === 'image')[0];
		const url = `https://dotfyle.com/plugins/${plugin.owner}/${plugin.name}?utm_source=plugins-rss`;
		const content = template
			.replace('{title}', title)
			.replace('{url}', url)
			.replace('{description}', plugin.shortDescription)
			.replace('{image}', image?.url);
		const html = marked(content);
		const description = await sanitizeHtml(html);
		feed.item({
			title,
			url,
			date: plugin.createdAt,
			description
		});
	}

	const xml = feed.xml({ indent: true });

	return xml;
}
