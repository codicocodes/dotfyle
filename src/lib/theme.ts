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
