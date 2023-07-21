import type { NeovimConfigWithMetaData } from '$lib/server/prisma/neovimconfigs/schema';
import type { NeovimPluginWithCount } from '$lib/server/prisma/neovimplugins/schema';
import { trpc } from '$lib/trpc/client';
import { sanitizeHtml } from '$lib/utils';
import type { LanguageServer } from '@prisma/client';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import type { PageLoad, PageLoadEvent } from './$types';

export const load: PageLoad = async function load(event: PageLoadEvent) {
	const username = event.params.username;
  const slug = event.params.slug;
	const [config, plugins, languageServers] = await Promise.all([
		trpc(event).getConfigBySlug.query({
			username,
      slug,
		}) as unknown as NeovimConfigWithMetaData,
		trpc(event).getPluginsBySlug.query({
			username,
			slug
		}) as unknown as NeovimPluginWithCount[],
		trpc(event).getLanguageServersBySlug.query({
			username,
			slug
		}) as unknown as LanguageServer[]
	]).catch(() => {
		throw error(404);
	});

	let readme = '';

	const title = `# ${config.repo}/${config.root}\n\n`;

  const configPath = `${config.owner}/${config.slug}`

  const badges = ['plugins', 'leaderkey', 'plugin-manager'].map(api => {
    return `<a href="https://dotfyle.com/plugins/${configPath}"><img src="https://dotfyle.com/${configPath}/badges/${api}?style=flat" /></a>`
  }).join("").concat("\n\n")

  const badgeContainer = `<p>${badges}</p>\n\n`

	let installInstructions = '## Install Instructions\n\n > Install requires Neovim 0.9+. Always review the code before installing a configuration.\n\n';

	const installCommands: Record<string, string> = {
		lazy: `NVIM_APPNAME=${configPath}/${config.root} nvim --headless +Lazy! sync +qa`,
		packer: `NVIM_APPNAME=${configPath}/${config.root} nvim --headless +"PackerSync" +qa`
	};

	installInstructions = installInstructions.concat(
		'Clone the repository and install the plugins:\n\n'
	);

	installInstructions = installInstructions.concat(`\`\`\`sh
git clone git@github.com/${config.owner}/${config.repo} ~/.config/${config.owner}/${config.repo}
${installCommands[config.pluginManager?.toLowerCase() ?? 'unknown'] ?? ''}
\`\`\`\n\n`);

	installInstructions = installInstructions.concat('Open Neovim with this config:\n\n');

	installInstructions = installInstructions.concat(`\`\`\`sh
NVIM_APPNAME=${config.owner}/${config.repo}/${config.root} nvim
\`\`\`\n\n`);

	let pluginSection = '## Plugins\n\n';

	const pluginByCategory: Record<string, string[]> = {};

	for (const plugin of plugins) {
		pluginByCategory[plugin.category] = [];
	}

	for (const plugin of plugins) {
		const path = `${plugin.owner}/${plugin.name}`;
		pluginByCategory[plugin.category].push(path);
	}

	for (const [category, plugins] of Object.entries(pluginByCategory)) {
		let categoryPlugin = `### ${category}\n\n`;

		for (const plugin of plugins) {
			categoryPlugin = categoryPlugin.concat(
				`+ [${plugin}](https://dotfyle.com/plugins/${plugin})\n`
			);
		}
		pluginSection = pluginSection.concat(categoryPlugin);
	}


	let languageServerSection = '## Language Servers\n\n';

  for (const ls of languageServers) {
    languageServerSection = languageServerSection.concat(`+ ${ls.name}\n`)
  }

	readme = readme.concat(title).concat(badgeContainer).concat(installInstructions).concat(pluginSection).concat(languageServerSection)

	const html = sanitizeHtml(marked(readme));

	return {
		readme,
		html
	};
};
