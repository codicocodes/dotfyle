<script>
	import { browser } from '$app/environment';
	import { getTheme, setTheme } from '$lib/theme';
	import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	$: isLightMode = browser && getTheme() === 'light';
</script>

<button
	aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
	title={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
	type="button"
	class="flex gap-4 w-full bg-black/30 p-4 rounded-lg justify-center items-center border-[1px] border-accent-muted hover:border-accent-bright"
	on:click={() => {
		isLightMode = !isLightMode;
		setTheme(isLightMode ? 'light' : 'dark');
	}}
>
	<Fa icon={isLightMode ? faSun : faMoon} size="1.5x" />
	<span>{isLightMode ? 'light mode' : 'dark mode'}</span>
</button>
