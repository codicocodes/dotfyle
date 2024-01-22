<script lang="ts">
	import { browser } from '$app/environment';
	import Button from '$lib/components/Button.svelte';
	import HtmlContent from '$lib/components/HtmlContent.svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';
	import ShareContainer from '$lib/components/ShareContainer.svelte';
	import SmallTitle from '$lib/components/SmallTitle.svelte';
	import { updateLatestReadTwinPost } from '$lib/services/twin';
	import { faCalendarDay, faChevronLeft, faChevronRight, faNewspaper } from '@fortawesome/free-solid-svg-icons';
	import type { PageData } from './$types';
	import Fa from 'svelte-fa';
	export let data: PageData;
	$: url = `https://dotfyle.com/this-week-in-neovim/${data.post.issue}`;
	$: tweetText = `This Week in Neovim ${data.post.title.replace('#', '')}`;
	$: {
		if (browser) {
			updateLatestReadTwinPost(data.post.issue);
		}
	}
</script>

<svelte:head>
	<title>{data.post.title}</title>
	<OpenGraph
		title={data.post.title}
		url="https://dotfyle.com/this-week-in-neovim/{data.post.issue}"
		description="This Week in Neovim {data.post
			.issue} with news and updates from the Neovim plugin ecosystem and Neovim core."
		image="/twin.png"
	/>
</svelte:head>

<h1 class="p-2">
	<SmallTitle title={data.post.title} />
</h1>

{#if data.post.publishedAt}
	<div class="flex gap-4 mx-2 items-center">
	<h5 class="flex items-center gap-2">
		<Fa icon={faNewspaper} />
		<span>Issue #{data.post.issue}
	</h5>
	<h5 class="flex items-center gap-1">
		<Fa icon={faCalendarDay} />
		<time class="font-light p-2" itemprop="datePublished" datetime={data.post.publishedAt}>
			{new Date(data.post.publishedAt).toLocaleDateString()}
		</time>
	</h5>
</div>
{/if}

<div class="flex w-full justify-center">
	<ShareContainer
		{url}
		{tweetText}
		emailSubject="Checkout This Week in Neovim {data.post.issue}"
		emailBody="Check out {data.post.title.replaceAll('#', '')}"
	/>
</div>

<div class="flex justify-between p-2">
	{#if data.post.issue > 1}
		<a href="/this-week-in-neovim/{data.post.issue - 1}">
			<Button iconPosition="left" text="Previous" icon={faChevronLeft} />
		</a>
	{:else}
		<div />
	{/if}
	{#if data.post.issue < data.post.total}
		<a href="/this-week-in-neovim/{data.post.issue + 1}">
			<Button text="Next" icon={faChevronRight} />
		</a>
	{/if}
</div>

<HtmlContent content={data.post.cleanHtml} />

{#if data.post.license === 'CC-BY-SA'}
	<a
		href="https://github.com/phaazon/this-week-in-neovim-contents/blob/master/LICENSE"
		target="_blank"
	>
		<img
			height="10"
			width="10"
			alt="CC-BY-SA"
			src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-sa.svg"
		/>
	</a>
{/if}
