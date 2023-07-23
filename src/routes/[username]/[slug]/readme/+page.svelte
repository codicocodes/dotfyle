<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CoolText from '$lib/components/CoolText.svelte';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import HtmlContent from '$lib/components/HtmlContent.svelte';
	import SmallTitle from '$lib/components/SmallTitle.svelte';
	import { copyToClipboard } from '$lib/utils';
	import { faCopy } from '@fortawesome/free-solid-svg-icons';
	import type { PageData } from './$types';
	export let data: PageData;
	let viewHtml = true;
</script>

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
				/
				{data.config.root}
			</CoolTextOnHover>
		</a>
		/
		<a href="/{data.config.owner}/{data.config.slug}/readme">
			<CoolTextOnHover>readme</CoolTextOnHover>
		</a>
	</div>
	<div class="my-8 flex flex-col gap-12">
		<SmallTitle title="Generated README for {data.config.repo}/{data.config.root}" />
		<p class="text-xl">
			You can use this automatically generated markdown in your configs GitHub Readme. Simply copy
			the markdown and paste it into your Readme.
		</p>
	</div>
	<div class="my-4 flex text-xl justify-between">
		<div class="flex gap-8">
			<button on:click={() => (viewHtml = true)}>
				{#if viewHtml}
					<CoolText text="HTML" />
				{:else}
					<CoolTextOnHover>HTML</CoolTextOnHover>
				{/if}
			</button>
			<button on:click={() => (viewHtml = false)}>
				{#if viewHtml}
					<CoolTextOnHover>Markdown</CoolTextOnHover>
				{:else}
					<CoolText text="Markdown" />
				{/if}
			</button>
		</div>

		<div class="flex gap-2">
			<a href="/{data.configPath}" class="flex items-center">
				<CoolTextOnHover>back to</CoolTextOnHover>
			</a>
			<Button icon={faCopy} text="Copy Markdown" on:click={() => copyToClipboard(data.readme)} />
		</div>
	</div>
	<hr class="my-4" />
	{#if viewHtml}
		<HtmlContent content={data.html} />
	{:else}
		<textarea class="w-full min-h-screen my-8" disabled>
			{data.readme}
		</textarea>
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
