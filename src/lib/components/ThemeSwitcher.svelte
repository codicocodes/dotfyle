<script>
	import { browser } from '$app/environment';
	import { getTheme, setTheme } from '$lib/theme';
	import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	$: isLightMode = browser && getTheme() === 'light';
</script>

<button
	aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
	type="button"
	on:click={() => {
		isLightMode = !isLightMode;
		setTheme(isLightMode ? 'light' : 'dark');
	}}
>
	<Fa icon={isLightMode ? faSun : faMoon} size="1.5x" />
</button>
