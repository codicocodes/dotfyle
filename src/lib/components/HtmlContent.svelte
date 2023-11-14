<script lang="ts">
	import { fade } from 'svelte/transition';
	export let content: string;
</script>

<div in:fade id="markdown-post-container" class="p-2">
	{@html content}
</div>

<style lang="postcss">
	:global(#markdown-post-container h1) {
		@apply text-4xl sm:text-4xl font-semibold tracking-wider my-8 break-words;
	}
	:global(#markdown-post-container h2) {
		@apply text-3xl sm:text-4xl font-semibold tracking-wider my-4;
	}
	:global(#markdown-post-container h3) {
		@apply text-2xl sm:text-3xl font-semibold tracking-wider my-4;
	}
	:global(#markdown-post-container h4) {
		@apply text-xl sm:text-2xl font-semibold tracking-wider my-2;
	}
	:global(#markdown-post-container p) {
		@apply text-sm sm:text-lg my-2 gap-2 break-words;
	}
	:global(#markdown-post-container li) {
		@apply text-sm sm:text-lg list-disc ml-8 py-1 break-words;
	}
	:global(#markdown-post-container pre) {
		@apply bg-black p-4 sm:p-8 rounded-lg my-4 overflow-x-scroll text-sm sm:text-lg;
	}
	:global(#markdown-post-container a) {
		@apply text-transparent bg-clip-text bg-gradient-primary;
	}
	:global(#markdown-post-container hr) {
		@apply my-8;
	}
	:global(#markdown-post-container blockquote) {
		@apply bg-base-800 p-2 border-l-4 my-2;
	}
	:global(#markdown-post-container code) {
		@apply bg-black p-1 text-white;
	}
	:global(#markdown-post-container img) {
		@apply p-1;
	}
	:global(#markdown-post-container iframe) {
		@apply w-full my-2;
	}
</style>
