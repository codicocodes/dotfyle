<script lang="ts">
	import CoolText from '$lib/components/CoolText.svelte';
	import MediumHeroTitle from '$lib/components/MediumHeroTitle.svelte';
</script>

<MediumHeroTitle>
	<a href="/this-week-in-neovim">
		<CoolText text="This Week in Neovim" />
	</a>
</MediumHeroTitle>
<slot />
