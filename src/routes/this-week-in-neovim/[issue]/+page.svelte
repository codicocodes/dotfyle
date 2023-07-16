<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import HeroTitle from '$lib/components/HeroTitle.svelte';
	import HtmlContent from '$lib/components/HtmlContent.svelte';
	import SmallTitle from '$lib/components/SmallTitle.svelte';
	import { faTwitter } from '@fortawesome/free-brands-svg-icons';
	import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';
	export let data: PageData;
	$: url = `https://dotfyle.com/this-week-in-neovim/${data.post.issue}`;
	$: tweetText = `This Week in Neovim ${data.post.title.replace('#', '')}`;
	$: tweetUrl = `https://twitter.com/intent/tweet?url=${url}&text=${tweetText}`;
</script>

<h1 class="p-2">
	<SmallTitle title={data.post.title} />
</h1>

{#if data.post.publishedAt}
	<h5 class="flex justify-center">
		<time class="font-light p-2" itemprop="datePublished" datetime={data.post.publishedAt}>
      {new Date(data.post.publishedAt).toLocaleDateString()}
    </time>
	</h5>
{/if}

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

<div class="flex mt-2">
	<a href={tweetUrl} target="blank" class="block p-4 bg-blue-400 rounded-full">
		<Fa icon={faTwitter} />
	</a>
</div>
