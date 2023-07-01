<script lang="ts">
	import { page } from '$app/stores';
	import CoolText from '$lib/components/CoolText.svelte';
	import MediumHeroTitle from '$lib/components/MediumHeroTitle.svelte';
</script>

<svelte:head>
	{#if $page.url.pathname === '/this-week-in-neovim'}
		<title>This Week in Neovim</title>
		<meta name="description" content="Newsletter about the Neovim plugin ecosystem" />
	{/if}
</svelte:head>

<MediumHeroTitle>
	<a href="/this-week-in-neovim">
		<CoolText text="This Week in Neovim" />
	</a>
</MediumHeroTitle>
<slot />
