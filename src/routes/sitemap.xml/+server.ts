import { prismaClient } from '$lib/server/prisma/client';
import { getAllNeovimPluginNames } from '$lib/server/prisma/neovimplugins/service';
import type { RequestHandler } from '@sveltejs/kit';

const website = 'https://dotfyle.com';

const createSitemap = (
	twinIssues: number[],
	plugins: string[],
	configs: string[]
) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
  >
<url>
  <loc>${website}</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>${website}/this-week-in-neovim</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>${website}/neovim/plugins/trending</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>${website}/neovim/plugins/top</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>${website}/neovim/plugins/new</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>${website}/neovim/colorscheme/trending</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>${website}/neovim/colorscheme/top</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>${website}/neovim/colorscheme/new</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>${website}/neovim/configurations/top</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>${website}/neovim/configurations/new</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>${website}/neovim/configurations/plugins</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>${website}/guides/plugins-usage-badge</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>${website}/guides/auto-generated-readme</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
${plugins
	.map(
		(plugin) => `
         <url>
         <loc>${website}/${plugin}</loc>
         <changefreq>daily</changefreq>
         <priority>0.7</priority>
         </url>
         `
	)
	.join('')}
${twinIssues
	.map(
		(issue) => `
         <url>
         <loc>${website}/this-week-in-neovim/${issue}</loc>
         <changefreq>weekly</changefreq>
         <priority>0.5</priority>
         </url>
         `
	)
	.join('')}
${configs
	.map(
		(config) => `
         <url>
         <loc>${website}/${config}</loc>
         <changefreq>daily</changefreq>
         <priority>0.7</priority>
         </url>
         `
	)
	.join('')}
      </urlset>`;

const getTwinIssues = async () => {
	const posts = await prismaClient.twinPost.findMany({
		where: {
			publishedAt: {
				not: null
			}
		},
		select: {
			issue: true
		},
		orderBy: {
			issue: 'desc'
		}
	});
	return posts.map(({ issue }) => issue);
};

const getPluginPages = async () => {
	const identifiers = await getAllNeovimPluginNames();
	return identifiers.map(({ owner, name }) => `plugins/${owner}/${name}`);
};

const getNeovimConfigs = async () => {
	const configs = await prismaClient.neovimConfig.findMany({
		select: {
			owner: true,
			slug: true
		},
		where: {
			stars: {
				gt: 10
			}
		}
	});
	return configs.flatMap(({ owner, slug }) => [`${owner}/${slug}`, owner]);
};

export const GET: RequestHandler = async () => {
	const [issues, plugins, configs] = await Promise.all([
		getTwinIssues(),
		getPluginPages(),
		getNeovimConfigs()
	]);
	const sitemap = createSitemap(issues, plugins, configs);
	return new Response(sitemap, {
		headers: {
			'Cache-Control': `public, max-age=0, s-maxage=${60 * 60 * 24}`, // seconds
			'Content-Type': 'application/rss+xml'
		}
	});
};
