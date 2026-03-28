<script lang="ts">
  import { run, self, createBubbler, stopPropagation } from 'svelte/legacy';

  const bubble = createBubbler();
  import { faCheck } from '@fortawesome/free-solid-svg-icons';
  import Button from './Button.svelte';

  interface Props {
    showModal: boolean;
    onClose: () => void;
    header?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
  }

  let { showModal, onClose, header, children }: Props = $props();

  let dialog: HTMLDialogElement = $state();

  run(() => {
    if (dialog && showModal) dialog.showModal();
  });
</script>

<dialog
  class="bg-gray text-white p-4"
  bind:this={dialog}
  onclose={() => onClose()}
  onclick={self(() => dialog.close())}
>
  <div role="presentation" onclick={stopPropagation(bubble('click'))}>
    {@render header?.()}
    {@render children?.()}
    <div class="flex w-full justify-center">
      <Button icon={faCheck} text="Done" loading={false} on:click={() => dialog.close()} />
    </div>
  </div>
</dialog>

<style>
  dialog {
    border-radius: 0.2em;
    border: none;
    padding: 0;
  }
  /* dialog::backdrop {
		background: rgba(0, 0, 0, 0.3); 
	} */
  dialog > div {
    padding: 1em;
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
