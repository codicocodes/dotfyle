<script lang="ts">
  import CoolText from '$lib/components/CoolText.svelte';
  import MediumHeroTitle from '$lib/components/MediumHeroTitle.svelte';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="my-4 sm:my-8">
  <MediumHeroTitle>
    <a href="/this-week-in-neovim">
      <CoolText text="This Week in Neovim" />
    </a>
  </MediumHeroTitle>
</div>
{@render children?.()}
