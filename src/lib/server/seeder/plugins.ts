import { marked } from 'marked';
import { z } from 'zod';
import { PluginDTO } from '../prisma/neovimplugins/schema';

export async function scrapeRockerBooAwesomeNeovim() {
	const tree = await fetchReadme();
	const rawPlugins = parsePluginDataFromTree(tree);
	return z
		.array(PluginDTO)
		.parse(
			rawPlugins.map(parseCategory).filter(isTrackedCategory).map(parsePlugin).filter(hasGithubLink)
		)
		.filter(isValidRepo);
}

function isValidRepo(plugin: PluginDTO) {
	const { name } = plugin;
	return !name.includes('#');
}

function hasGithubLink(plugin: PluginDTO) {
	return plugin.link.startsWith('https://github.com');
}

function parsePluginLink(item: string): string {
	const match = /\(([^)]+)\)/.exec(item);
	if (!match || typeof match[1] !== 'string') throw new Error('Unexpected');
	return match[1];
}

function parsePluginFullName(item: string): string {
	const match = /\[(.*?)\]/.exec(item);
	if (!match || typeof match[1] !== 'string') throw new Error('Unexpected');
	return match[1];
}

export function parsePlugin({ category, item }: RawPlugin): PluginDTO {
	const [plugin, description] = item.split(' - ');
	const link = parsePluginLink(plugin);
	const fullName = parsePluginFullName(plugin);
	const [owner, repo] = fullName.split('/');
	return {
		type: 'github',
		source: 'rockerboo-awesome-neovim',
		category,
		link,
		owner,
		name: repo,
		shortDescription: description
	};
}

export async function fetchReadme(): Promise<marked.TokensList> {
	const RAW_README_URL =
		'https://raw.githubusercontent.com/rockerBOO/awesome-neovim/main/README.md';
	const text = await fetch(RAW_README_URL).then((r) => r.text());
	const tree = marked.lexer(text);
	return tree;
}

export interface RawPlugin {
	category: string;
	item: string;
}

export function parsePluginDataFromTree(tree: marked.TokensList): RawPlugin[] {
	const plugins = [] as RawPlugin[];
	let category: string | undefined;
	for (const token of tree) {
		if (token.type === 'heading') {
			category = token.text;
		}
		if (!category) continue;
		if (token.type === 'list') {
			for (const item of token.items) {
				plugins.push({
					category,
					item: item.text
				});
			}
		}
	}
	return plugins;
}

export function parseCategory(plugin: RawPlugin) {
	let category = plugin.category.toLocaleLowerCase().replaceAll(/\s/g, '-');
	if (category === '(requires-neovim-0.5)') {
		category = 'lsp';
	}
	if (category === 'neovim-lua-development') {
		category = 'nvim-dev';
	}
	if (category === 'tree-sitter-supported-colorscheme') {
		category = 'colorscheme';
	}
	return { ...plugin, category };
}

export function isTrackedCategory(p: RawPlugin) {
	return !['contents', 'vim', 'ui', 'wishlist', 'resource'].includes(p.category);
}
