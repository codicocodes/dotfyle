<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import MarkdownPost from '$lib/components/MarkdownPost.svelte';
	import SmallTitle from '$lib/components/SmallTitle.svelte';
	import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>
	<SmallTitle title={data.title} />
</h1>

<div class="flex justify-between">
	{#if data.issue > 1}
		<a href="/this-week-in-neovim/{data.issue - 1}">
			<Button iconPosition="left" text="Previous" icon={faChevronLeft} />
		</a>
	{:else}
		<div />
	{/if}
	{#if data.issue < data.total}
		<a href="/this-week-in-neovim/{data.issue + 1}">
			<Button text="Next" icon={faChevronRight} />
		</a>
	{/if}
</div>

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
