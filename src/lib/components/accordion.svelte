<script lang="ts">
  import { nanoid } from 'nanoid';
  import Fa from 'svelte-fa';
  import GlossyCard from './GlossyCard.svelte';
  import { faCircleChevronDown, faCircleChevronUp } from '@fortawesome/free-solid-svg-icons';
  interface Props {
    open?: boolean;
    title?: import('svelte').Snippet;
    description?: import('svelte').Snippet;
    content?: import('svelte').Snippet;
  }

  let { open = $bindable(false), title, description, content }: Props = $props();
  const id = nanoid();
</script>

<GlossyCard>
  <div class="flex flex-col w-full">
    <div class="p-4 flex flex-col justify-center">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onclick={() => (open = !open)}
        class="font-semibold text-xl w-full flex justify-between items-center h-full"
      >
        {@render title?.()}

        <Fa icon={!open ? faCircleChevronDown : faCircleChevronUp} size="sm" />
      </button>
      {@render description?.()}
    </div>
    {#if open}
      <div class="w-full" {id}>
        {@render content?.()}
      </div>
    {/if}
  </div>
</GlossyCard>
