<script lang="ts">
	import MarkdownPost from '$lib/components/MarkdownPost.svelte';
	import SmallTitle from '$lib/components/SmallTitle.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>
	<SmallTitle title={data.title} />
</h1>

<MarkdownPost content={data.content} />

{#if data.license === 'CC-BY-SA'}
	<a
		href="https://github.com/phaazon/this-week-in-neovim-contents/blob/master/LICENSE"
		target="_blank"
	>
		<img
			alt="CC-BY-SA"
			src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-sa.svg"
		/>
	</a>
{/if}
