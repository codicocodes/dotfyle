import { marked } from 'marked';
import { z } from 'zod';
import { PluginDTO } from '../prisma/neovimplugins/schema';
import { readFileSync } from 'fs';

export function getTrackedPlugins() {
  const tree = fetchTrackedPlugins();
  const rawPlugins = parsePluginDataFromTree(tree);
  return z.array(PluginDTO).parse(
    rawPlugins
      .map(parseCategory)
      .filter(isTrackedCategory)
      .map(({ category, item }) => {
        const plugin = item.replaceAll('`', '');
        const shortDescription = '';
        const link = `https://github.com/${plugin}`;
        const [owner, name] = plugin.split('/');
        return {
          type: 'github',
          source: 'submitted-plugins',
          category,
          link,
          owner,
          name,
          shortDescription
        };
      })
  );
}

export async function scrapeRockerBooAwesomeNeovim() {
  const tree = await fetchAwesomeNeovimReadme();
  const rawPlugins = parsePluginDataFromTree(tree);
  return z
    .array(PluginDTO)
    .parse(
      rawPlugins
        .map(parseCategory)
        .filter(isTrackedCategory)
        .map(parsePlugin)
        .filter(hasGithubLink)
        .filter((p) => p.name)
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
  let name = match[1];
  switch (name) {
    // incorrectly entered plugin name in rockerBOO/awesome-neovim
    case 'niuiic/dap-utils':
      name = 'niuiic/dap-utils.nvim';
      break;
    default:
      break;
  }
  return name;
}

export function parsePlugin({ category, item }: RawPlugin): PluginDTO {
  const [plugin, rawDescription] = item.split(' - ');
  const shortDescription = parseDescription(rawDescription);
  const link = parsePluginLink(plugin);
  const fullName = parsePluginFullName(plugin);
  const [owner, repo] = fullName.split('/');
  return {
    type: 'github',
    source: 'awesome-neovim',
    category,
    link,
    owner,
    name: repo,
    shortDescription
  };
}

export async function fetchAwesomeNeovimReadme(): Promise<marked.TokensList> {
  const RAW_README_URL =
    'https://raw.githubusercontent.com/rockerBOO/awesome-neovim/main/README.md';
  const text = await fetch(RAW_README_URL).then((r) => r.text());
  const tree = marked.lexer(text);
  return tree;
}

export function fetchTrackedPlugins() {
  const text = readFileSync('./SUBMITTED-PLUGINS.md', 'utf8');
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

export function parseDescription(rawDesc: string) {
  // return "";
  return rawDesc.replaceAll('\n', ' ');
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
  if (category === 'preconfigured-configuration') {
    category = 'preconfigured';
  }
  return { ...plugin, category };
}

export function isTrackedCategory(p: RawPlugin) {
  return !['contents', 'vim', 'ui', 'wishlist', 'resource'].includes(p.category);
}
