<script lang="ts">
	import SvelteMarkdown from "svelte-markdown";
	import { fade } from "svelte/transition";
  export let readme: string

</script>

<div 
  in:fade
  id="readme-md-container"
	class="rounded-md border border-green-300/25 bg-white/5 truncate text-ellipsis transition-colors shadow-md hover:shadow-green-300/25 p-8"
>
  <SvelteMarkdown 
    source={readme}
  />
  </div>

<style>
  :global(#readme-md-container h1) {
    @apply text-4xl font-semibold tracking-wider mb-4;
  }
  :global(#readme-md-container h2) {
    @apply text-3xl font-semibold tracking-wider;
  }
  :global(#readme-md-container h3) {
    @apply text-2xl font-semibold tracking-wider;
  }
  :global(#readme-md-container p) {
    @apply text-lg my-2 flex gap-2;
  }
  :global(#readme-md-container li) {
    @apply text-lg list-disc ml-8 py-1;
  }
  :global(#readme-md-container pre) {
    @apply bg-stone-900 p-8 rounded-lg my-4;
  }
</style>
