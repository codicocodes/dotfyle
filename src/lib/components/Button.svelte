<script lang="ts">
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { DoubleBounce } from 'svelte-loading-spinners';
	export let text: string;
	export let icon: IconDefinition;
  export let loading: boolean
</script>

<button
	class={`bg-white/30  p-2 py-1 xl:px-2 xl:py-1 rounded flex gap-1 items-center ${loading ? "hover:cursor-not-allowed hover:bg-white/10" : "shadow-lg hover:shadow-green-300/25 hover:bg-gradient-to-br hover:from-cyan-500 hover:to-green-500 "}`}
	type="submit"
  disabled={loading}
>
	{text}
  {#if loading}
	  <DoubleBounce color="#15be97" size="8" />
  {:else}
    <Fa class="ml-1" size="xs" {icon} />
  {/if}
</button>
