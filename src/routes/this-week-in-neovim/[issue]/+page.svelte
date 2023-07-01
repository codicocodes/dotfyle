<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import MarkdownPost from '$lib/components/MarkdownPost.svelte';
	import SmallTitle from '$lib/components/SmallTitle.svelte';
	import { faTwitter } from '@fortawesome/free-brands-svg-icons';
	import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';
	export let data: PageData;
	$: url = `https://dotfyle.com/this-week-in-neovim/${data.issue}`;
	$: tweetText = `This Week in Neovim ${data.title.replace('#', '')}`;
	$: tweetUrl = `https://twitter.com/intent/tweet?url=${url}&text=${tweetText}`;
</script>

<svelte:head>
	<title>This Week in Neovim {data.title}</title>
	<meta name="description" content="Newsletter about the Neovim plugin ecosystem" />
</svelte:head>

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

<div class="flex mt-2">
	<a href={tweetUrl} target="blank" class="block p-4 bg-blue-400 rounded-full">
		<Fa icon={faTwitter} />
	</a>
</div>
