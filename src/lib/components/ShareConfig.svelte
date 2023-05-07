<script lang="ts">
	import { browser } from '$app/environment';
	import Fa from 'svelte-fa';
	import { faShare } from '@fortawesome/free-solid-svg-icons';
	import CoolTextWithChildren from './CoolTextWithChildren.svelte';
	import { faTwitter } from '@fortawesome/free-brands-svg-icons';
	import { onDestroy, onMount } from 'svelte';
	let open = false;
	export let owner: string;
	export let slug: string;
	let url = `https://dotfyle.com/${owner}/${slug}`;
	let tweetText = `Neovim config by ${owner}`;
	let tweetUrl = `https://twitter.com/intent/tweet?url=${url}&text=${tweetText}&via=codicocodes&related=neovim`;

	function handleEscape(event: KeyboardEvent) {
		if (event.code === 'Escape') open = false;
	}

	onMount(() => {
		if (browser) document.addEventListener('keydown', handleEscape);
	});

	onDestroy(() => {
		if (browser) document.removeEventListener('keydown', handleEscape, true);
	});
</script>

<button on:click={() => (open = !open)} class=" bg-gray-700 p-2 rounded">
	<CoolTextWithChildren>
		<div class="flex flex-row gap-2">
			<div class="flex items-center force-white-text">
				<Fa icon={faShare} />
			</div>
			<span class="font-semibold">share</span>
		</div>
	</CoolTextWithChildren>
</button>

{#if open}
	<div
		on:click={() => (open = false)}
		class="z-10 fixed top-0 right-0 h-screen w-screen flex items-center justify-center"
	>
		<div
			on:click={(e) => {
				e.stopPropagation();
			}}
			class="z-50 fixed bg-gray-700 p-8 flex flex-col gap-8 rounded w-full mx-2 sm:w-1/3"
		>
			<h2 class="flex w-full font-semibold">Share</h2>
			<div class="flex">
				<a href={tweetUrl} target="blank" class="block p-4 bg-blue-400 rounded-full">
					<Fa icon={faTwitter} />
				</a>
			</div>
		</div>
	</div>
{/if}
