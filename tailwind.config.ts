import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Inter Variable', ...fontFamily.sans]
		},
		extend: {}
	},
	plugins: []
} satisfies Config;
