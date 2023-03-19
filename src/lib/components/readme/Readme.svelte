<script lang="ts">
	import SvelteMarkdown from "svelte-markdown";
	import { fade } from "svelte/transition";
  export let readme: string

</script>

<div 
  in:fade
  id="readme-md-container"
	class="rounded-md border border-green-300/25 bg-white/5 transition-colors shadow-md hover:shadow-green-300/25 p-8"
>
  <SvelteMarkdown 
    source={readme}
  />
  </div>

<style lang="postcss">
  :global(#readme-md-container h1) {
    @apply text-lg sm:text-4xl font-semibold tracking-wider mb-4 break-words;
  }
  :global(#readme-md-container h2) {
    @apply sm:text-3xl font-semibold tracking-wider;
  }
  :global(#readme-md-container h3) {
    @apply sm:text-2xl font-semibold tracking-wider;
  }
  :global(#readme-md-container p) {
    @apply text-sm sm:text-lg my-2 gap-2 break-words;
  }
  :global(#readme-md-container li) {
    @apply text-sm sm:text-lg list-disc ml-8 py-1 break-words;
  }
  :global(#readme-md-container pre) {
    @apply bg-black p-4 sm:p-8 rounded-lg my-4 overflow-x-scroll text-sm sm:text-lg bg-opacity-50;
  }
  :global(#readme-md-container a) {
    @apply text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-green-500 font-semibold tracking-tight;
  }
</style>
