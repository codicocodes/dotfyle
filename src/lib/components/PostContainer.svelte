<script lang="ts">
  import type { JsonPostContainer } from '$lib/types';
  import BreakingChangePost from './BreakingChangePost.svelte';

  interface Props {
    post: JsonPostContainer;
  }

  let { post }: Props = $props();
</script>

{#if post.breakingChange}
  <BreakingChangePost post={post as import('$lib/types').JsonBreakingChangePost} />
{/if}
