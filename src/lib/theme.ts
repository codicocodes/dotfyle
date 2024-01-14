const themes = ['light', 'dark'] as const;
export type ThemeName = (typeof themes)[number];

export const setTheme = (theme: ThemeName) => {
	localStorage.setItem('theme', theme);
	if (theme === 'light') document.documentElement.classList.add('light');
	else document.documentElement.classList.remove('light');
};

export const getTheme = () => {
	let theme = localStorage.getItem('theme');
	if (!theme || !themes.includes(theme as ThemeName))
		theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	return theme as ThemeName;
};

export const colorschemes = [
	{
		name: 'neovim',
		bg: 'bg-gradient-neovim'
	},
	{
		name: 'gruvbox',
		bg: 'bg-gradient-gruvbox'
	},
	{
		name: 'tokyonight',
		bg: 'bg-gradient-tokyonight'
	},
	{
		name: 'rose-pine',
		bg: 'bg-gradient-rose-pine'
	}
] as const;

export type ColorschemeNames = (typeof colorschemes)[number]['name'];

export const initColorscheme = () => {
	let theme = localStorage.getItem('colorscheme');
	if (!theme || !colorschemes.map(c => c.name).includes(theme as ColorschemeNames))
		theme = 'neovim'
	setColorscheme(theme as ColorschemeNames)
}

export const setColorscheme = (theme: ColorschemeNames) => {
	// Remove other themes
	const themes = colorschemes.map((c) => c.name);
	for (const t of themes) {
		if (t !== theme) {
			document.documentElement.classList.remove(t);
		}
	}
	// Set theme
	localStorage.setItem('colorscheme', theme);
	document.documentElement.classList.add(theme);
};

