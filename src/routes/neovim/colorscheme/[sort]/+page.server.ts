import { getPluginsWithMedia } from '$lib/server/prisma/neovimplugins/service';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

const content = {
  new: {
    title: 'New Neovim Colorschemes',
    description: 'The newest Neovim colorschemes on Dotfyle',
    ogTitle: `New Neovim Colorschemes in ${new Date().getFullYear()}`,
    ogDescription: `Learn about the newest Neovim colorschemes in ${new Date().getFullYear()}.`
  },
  popular: {
    title: 'Top Neovim Colorschemes',
    description: 'The most popular Neovim colorschemes on Dotfyle',
    ogTitle: `Top Neovim Colorschemes in ${new Date().getFullYear()}`,
    ogDescription: `Learn about the most popular Neovim colorschemes in ${new Date().getFullYear()}.`
  },
  trending: {
    title: 'Trending Neovim Colorschemes',
    description: 'Trending Neovim colorschemes on Dotfyle today',
    ogTitle: `Trending Neovim Colorschemes in ${new Date().getFullYear()}`,
    ogDescription: `Learn about trending Neovim colorschemes in ${new Date().getFullYear()}.`
  }
} as const;

const getPage = (event: PageServerLoadEvent) => {
  const rawPage = event.url.searchParams.get('page') ?? '';
  const page = parseInt(rawPage, 10);
  return isNaN(page) ? 1 : page;
};

const getSorting = (event: PageServerLoadEvent) => {
  const { sort } = event.params;
  try {
    const sorting = z.enum(['new', 'top', 'popular', 'trending']).parse(sort);
    switch (sorting) {
      case 'top':
        return 'popular';
      default:
        return sorting;
    }
  } catch {
    throw error(404);
  }
};

export const load: PageServerLoad = async function load(event: PageServerLoadEvent) {
  const sorting = getSorting(event);
  const page = getPage(event);
  const res = await getPluginsWithMedia('colorscheme', sorting, page, 10);
  return {
    plugins: res.data,
    pagination: res.meta,
    content: content[sorting],
    navigation: ['Trending', 'Top', 'New'].map((label) => {
      const value = label.toLowerCase();
      return {
        label,
        value,
        path: `/neovim/colorscheme/${value}`
      };
    })
  };
};
