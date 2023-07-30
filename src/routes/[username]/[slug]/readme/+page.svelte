<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CoolText from '$lib/components/CoolText.svelte';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import HtmlContent from '$lib/components/HtmlContent.svelte';
	import SmallTitle from '$lib/components/SmallTitle.svelte';
	import { copyToClipboard } from '$lib/utils';
	import { faCopy } from '@fortawesome/free-solid-svg-icons';
	import { Highlight } from 'svelte-highlight';
	import { markdown } from 'svelte-highlight/languages';
	import { githubDark } from 'svelte-highlight/styles';
	import type { PageData } from './$types';
	export let data: PageData;
	let view = 'html';

	let style = 'flat';
	$: badgesHtml = `<a href="https://dotfyle.com/${data.config.owner}/${data.config.slug}"><img src="https://dotfyle.com/${data.config.owner}/${data.config.slug}/badges/plugins?style=${style}" /></a>
<a href="https://dotfyle.com/${data.config.owner}/${data.config.slug}"><img src="https://dotfyle.com/${data.config.owner}/${data.config.slug}/badges/leaderkey?style=${style}" /></a>
<a href="https://dotfyle.com/${data.config.owner}/${data.config.slug}"><img src="https://dotfyle.com/${data.config.owner}/${data.config.slug}/badges/plugin-manager?style=${style}" /></a>`;
</script>

<svelte:head>
	{@html githubDark}
</svelte:head>

<div class="px-4">
	<div class="text-xl flex gap-2 items-center font-semibold">
		<img
			alt=""
			class="inline h-8 w-8 rounded-full items-center"
			height="8"
			width="8"
			src={data.config.ownerAvatar}
		/>
		<a href="/{data.config.owner}">
			<CoolTextOnHover>
				{data.config.owner}
			</CoolTextOnHover>
		</a>
		/
		<a href="/{data.config.owner}/{data.config.slug}">
			<CoolTextOnHover>
				{data.config.repo}
				{!data.config.root ? data.config.root : `/ ${data.config.root}`}
			</CoolTextOnHover>
		</a>
		/
		<a href="/{data.config.owner}/{data.config.slug}/readme">
			<CoolTextOnHover>readme</CoolTextOnHover>
		</a>
	</div>
	<div class="my-8 flex flex-col gap-12 tracking-wide">
		<SmallTitle title="Generated README for {data.config.repo}/{data.config.root}" />

		<div class="flex flex-col gap-2">
			<p class="text-xl">
				You can use this automatically generated markdown in your configs GitHub Readme. Simply copy
				the markdown, edit it however you like, and paste it into your Readme.
			</p>
			<p class="text-xl">
				If you don't want to use the full Readme you can use the Dotfyle badges to display the
				number of plugins installed, your leaderkey and plugin manager.
			</p>
		</div>
	</div>

	<div class="my-4 flex text-xl justify-between">
		<div class="flex gap-8">
			<button on:click={() => (view = 'html')}>
				{#if view === 'html'}
					<CoolText text="HTML" />
				{:else}
					<CoolTextOnHover>HTML</CoolTextOnHover>
				{/if}
			</button>
			<button on:click={() => (view = 'markdown')}>
				{#if view === 'markdown'}
					<CoolText text="Markdown" />
				{:else}
					<CoolTextOnHover>Markdown</CoolTextOnHover>
				{/if}
			</button>
			<button on:click={() => (view = 'badges')}>
				{#if view === 'badges'}
					<CoolText text="Badges" />
				{:else}
					<CoolTextOnHover>Badges</CoolTextOnHover>
				{/if}
			</button>
		</div>

		<div class="flex gap-4">
			<a href="/{data.config.owner}/{data.config.slug}" class="flex items-center">
				<CoolTextOnHover>back to config</CoolTextOnHover>
			</a>
			<Button icon={faCopy} text="Copy README" on:click={() => copyToClipboard(data.readme)} />
		</div>
	</div>
	<hr class="my-4" />
	{#if view === 'html'}
		<HtmlContent content={data.html} />
	{:else if view === 'markdown'}
		<Highlight class="w-full my-8 overflow-x-scroll" code={data.readme} language={markdown} />
	{:else if view === 'badges'}
		<div class="flex flex-col w-full gap-2">
			<div class="flex flex-col w-full gap-2">
				<div class="flex w-full items-center gap-2 font-medium text-sm">
					<div class="flex flex-col gap-6">
						<div class="flex w-full gap-2">
							{#each ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'] as currStyle}
								<GlossyCard>
									<button
										on:click={() => (style = currStyle)}
										class="p-2 px-4 {currStyle === style ? 'bg-green-400/25' : ''}"
									>
										{currStyle}
									</button>
								</GlossyCard>
							{/each}
							<Button
								icon={faCopy}
								text="Copy Badges"
								on:click={() => copyToClipboard(badgesHtml)}
							/>
						</div>

						<div class="flex w-full gap-2">
							{#each ['plugins', 'leaderkey', 'plugin-manager'] as badge}
								<img
									alt={badge}
									src="/{data.config.owner}/{data.config.slug}/badges/{badge}?style={style}"
								/>
							{/each}
						</div>
					</div>
				</div>
				<Highlight class="my-4 rounded" code={badgesHtml} language={markdown} />
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	textarea {
		@apply bg-transparent text-xl;
	}

	button {
		@apply font-semibold cursor-pointer;
	}
</style>
