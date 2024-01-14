const themes = ['light', 'dark'] as const;
export type ThemeName = (typeof themes)[number];

export const setTheme = (theme: ThemeName) => {
	document.cookie = `mode=${theme}; SameSite=Lax`;
	if (theme === 'light') document.documentElement.classList.add('light');
	else document.documentElement.classList.remove('light');
};

export const getTheme = () => {
	const cookie = document.cookie
		.split(';')
		.map((c) => c.trim().split('='))
		.find((c) => c[0] === 'mode');
	let theme = cookie?.[1];
	if (!theme || !themes.includes(theme[1] as ThemeName))
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

export const setColorscheme = (theme: ColorschemeNames) => {
	// Remove other themes
	const themes = colorschemes.map((c) => c.name);
	for (const t of themes) {
		if (t !== theme) {
			document.documentElement.classList.remove(t);
		}
	}
	// Set theme
	document.documentElement.classList.add(theme);
	document.cookie = `colorscheme=${theme}; SameSite=Lax;`;
};

export const getColorscheme = () => {
	const cookie = document.cookie
		.split(';')
		.map((c) => c.trim().split('='))
		.find((c) => c[0] === 'colorscheme');
	let theme = cookie?.[1];
	if (!theme || !colorschemes.some((t) => t.name === theme)) {
		theme = 'neovim';
	}
	return theme as ColorschemeNames;
};
