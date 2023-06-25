<script lang="ts">
	import type { JsonPostContainer } from '$lib/types';
	import BreakingChangePost from './BreakingChangePost.svelte';

  export let post: JsonPostContainer
</script>

{#if post.breakingChange}
  <BreakingChangePost post={post} />
{/if}

