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
				gray: {
					50: 'rgb(var(--color-gray-50) / <alpha-value>)',
					100: 'rgb(var(--color-gray-100) / <alpha-value>)',
					200: 'rgb(var(--color-gray-200) / <alpha-value>)',
					300: 'rgb(var(--color-gray-300) / <alpha-value>)',
					400: 'rgb(var(--color-gray-400) / <alpha-value>)',
					500: 'rgb(var(--color-gray-500) / <alpha-value>)',
					600: 'rgb(var(--color-gray-600) / <alpha-value>)',
					700: 'rgb(var(--color-gray-700) / <alpha-value>)',
					800: 'rgb(var(--color-gray-800) / <alpha-value>)',
					900: 'rgb(var(--color-gray-900) / <alpha-value>)',
					950: 'rgb(var(--color-gray-950) / <alpha-value>)'
				},
				neutral: {
					50: 'rgb(var(--color-neutral-50) / <alpha-value>)',
					100: 'rgb(var(--color-neutral-100) / <alpha-value>)',
					200: 'rgb(var(--color-neutral-200) / <alpha-value>)',
					300: 'rgb(var(--color-neutral-300) / <alpha-value>)',
					400: 'rgb(var(--color-neutral-400) / <alpha-value>)',
					500: 'rgb(var(--color-neutral-500) / <alpha-value>)',
					600: 'rgb(var(--color-neutral-600) / <alpha-value>)',
					700: 'rgb(var(--color-neutral-700) / <alpha-value>)',
					800: 'rgb(var(--color-neutral-800) / <alpha-value>)',
					900: 'rgb(var(--color-neutral-900) / <alpha-value>)',
					950: 'rgb(var(--color-neutral-950) / <alpha-value>)'
				},
				slate: {
					50: 'rgb(var(--color-slate-50) / <alpha-value>)',
					100: 'rgb(var(--color-slate-100) / <alpha-value>)',
					200: 'rgb(var(--color-slate-200) / <alpha-value>)',
					300: 'rgb(var(--color-slate-300) / <alpha-value>)',
					400: 'rgb(var(--color-slate-400) / <alpha-value>)',
					500: 'rgb(var(--color-slate-500) / <alpha-value>)',
					600: 'rgb(var(--color-slate-600) / <alpha-value>)',
					700: 'rgb(var(--color-slate-700) / <alpha-value>)',
					800: 'rgb(var(--color-slate-800) / <alpha-value>)',
					900: 'rgb(var(--color-slate-900) / <alpha-value>)',
					950: 'rgb(var(--color-slate-950) / <alpha-value>)'
				}
			}
		}
	},
	plugins: []
} satisfies Config;
