<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="hover:cursor-pointer text-transparent bg-clip-text bg-gradient-primary">
  {@render children?.()}
</div>
