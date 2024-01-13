import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Inter Variable', ...fontFamily.sans]
		},
		extend: {
			colors: {
				white: 'rgb(var(--color-white) / <alpha-value>)',
				black: 'rgb(var(--color-black) / <alpha-value>)',
				main: 'rgb(34 197 94)',
				accent: {
					muted: 'rgb(var(--color-accent-muted) / <alpha-value>)',
					bright: 'rgb(var(--color-accent-bright) / <alpha-value>)',
				},
				foreground: {
					muted: 'rgb(var(--color-foreground-muted) / <alpha-value>)',
					bright: 'rgb(var(--color-foreground-bright) / <alpha-value>)',
				},
				base: {
					50: 'rgb(var(--color-base-50) / <alpha-value>)',
					100: 'rgb(var(--color-base-100) / <alpha-value>)',
					200: 'rgb(var(--color-base-200) / <alpha-value>)',
					300: 'rgb(var(--color-base-300) / <alpha-value>)',
					400: 'rgb(var(--color-base-400) / <alpha-value>)',
					500: 'rgb(var(--color-base-500) / <alpha-value>)',
					600: 'rgb(var(--color-base-600) / <alpha-value>)',
					700: 'rgb(var(--color-base-700) / <alpha-value>)',
					800: 'rgb(var(--color-base-800) / <alpha-value>)',
					900: 'rgb(var(--color-base-900) / <alpha-value>)',
					950: 'rgb(var(--color-base-950) / <alpha-value>)'
				}
			}
		}
	},
	plugins: []
} satisfies Config;
