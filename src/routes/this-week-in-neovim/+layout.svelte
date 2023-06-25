<script lang="ts">
	import CoolText from "$lib/components/CoolText.svelte";
	import MediumHeroTitle from "$lib/components/MediumHeroTitle.svelte";

</script>
<svelte:head>
	<title>This Week in Neovim</title>
	<meta name="description" content="Newsletter about the Neovim plugin ecosystem" />
</svelte:head>

<MediumHeroTitle>
	<CoolText text="This Week in Neovim" />
</MediumHeroTitle>
<slot />
