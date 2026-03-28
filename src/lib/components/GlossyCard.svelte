<script lang="ts">
  interface Props {
    loading?: boolean;
    children?: import('svelte').Snippet;
  }

  let { loading = false, children }: Props = $props();
</script>

<div
  class="
   {loading ? 'animate-pulse' : ''}
    flex overflow-hidden rounded-lg
    bg-black/30 text-ellipsis transition-colors border-[0.5px] border-accent-muted hover:border-accent-bright
  "
>
  {@render children?.()}
</div>
