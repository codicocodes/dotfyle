<script lang="ts">
  import { faSave, faSync } from '@fortawesome/free-solid-svg-icons';
  import Button from './Button.svelte';

  interface Props {
    text: string;
    save: () => Promise<void>;
    generate: () => Promise<void>;
  }

  let { text = $bindable(), save, generate }: Props = $props();

  let saving = $state(false);
  async function runSave() {
    saving = true;
    await save();
    saving = false;
  }

  let generating = $state(false);
  async function runGenerate() {
    generating = true;
    await generate();
    generating = false;
  }
</script>

<div class="flex flex-col w-full gap-4 h-full">
  <textarea class="w-full rounded p-4 h-full" bind:value={text}></textarea>
  <div class="flex items-center w-full justify-end gap-2">
    <Button icon={faSync} text="Generate" on:click={runGenerate} loading={generating} />
    <Button icon={faSave} text="Save" on:click={runSave} loading={saving} />
  </div>
</div>
