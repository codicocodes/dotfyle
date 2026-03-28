<script lang="ts">
  import { createBubbler, preventDefault } from 'svelte/legacy';

  const bubble = createBubbler();
  import { page } from '$app/stores';
  import { navigate } from '$lib/navigate';
  import { faCircleXmark, faSearch } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  let search = $state($page.url.searchParams.get('q') ?? '');

  interface Props {
    placeholder: string;
  }

  let { placeholder }: Props = $props();

  let isfocused = $state(false);
  let inputRef: HTMLInputElement = $state();
</script>

<form
  action=""
  class="grow flex justify-center items-center gap-2"
  onchange={bubble('change')}
  onsubmit={preventDefault(() => {
    navigate($page, 'page', '1');
    navigate($page, 'q', search, true);
  })}
>
  <!-- TODO: move to global search and move to other component-->
  <div
    class="flex gap-2 w-full sm:w-3/4 md:w-2/3 xl:w-1/2 items-center p-2 sm:p-3 rounded-lg text-black text-sm font-medium focus:outline-none focus:border-main shadow-xl focus:shadow-main/25 focus:ring-1 focus:ring-main bg-white {isfocused
      ? 'shadow-xl shadow-main/25'
      : ''}"
  >
    <Fa icon={faSearch} class="ml-1" />
    <input
      bind:this={inputRef}
      type="search"
      bind:value={search}
      {placeholder}
      class="bg-transparent focus:outline-none w-full"
      onfocus={() => (isfocused = true)}
      onblur={() => (isfocused = false)}
    />
    {#if search}
      <button
        type="button"
        onclick={() => {
          search = '';
          navigate($page, 'q', search, true);
          inputRef.focus();
        }}
      >
        <Fa icon={faCircleXmark} class="mr-1" />
      </button>
    {/if}
  </div>
</form>
