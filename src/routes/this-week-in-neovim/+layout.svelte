<script lang="ts">
	import { page } from '$app/stores';
	import CoolText from '$lib/components/CoolText.svelte';
	import MediumHeroTitle from '$lib/components/MediumHeroTitle.svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';
</script>

<svelte:head>
  <title>{$page.data.seo?.title ?? "This Week in Neovim | Neovim news"}</title>
	<OpenGraph
		title={$page.data.seo?.title ?? "This Week in Neovim | Neovim news"}
		url="https://dotfyle.com/configs"
		description="Neovim news and updates from the Neovim plugin ecosystem"
	/>
</svelte:head>

<MediumHeroTitle>
	<a href="/this-week-in-neovim">
		<CoolText text="This Week in Neovim" />
	</a>
</MediumHeroTitle>
<slot />
