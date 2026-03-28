<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<main class="mx-auto md: max-w-xl lg:max-w-2xl xl:max-w-5xl">
  {@render children?.()}
</main>
