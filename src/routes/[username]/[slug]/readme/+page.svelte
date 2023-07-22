<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CoolLink from '$lib/components/CoolLink.svelte';
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
	<div class="my-8 flex flex-col gap-12">
		<SmallTitle title="Automatically Generated Readme for {data.configPath}" />
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
				<CoolTextOnHover>
					back to {data.configPath.split('/')[1]}
				</CoolTextOnHover>
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
