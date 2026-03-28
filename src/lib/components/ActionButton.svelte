<script lang="ts">
	import { faEllipsisVertical, faSync } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	interface Props {
		actions?: import('svelte').Snippet;
	}

	let { actions }: Props = $props();
	let isOpen = $state(false);
</script>

<button
	class="w-10 h-10 rounded-full flex items-center justify-center relative border-[1px] border-transparent hover:border-secondary"
	onclick={() => (isOpen = !isOpen)}
>
	<Fa icon={faEllipsisVertical} />
	{#if isOpen}
		<div class="absolute top-10 right-0 z-50 bg-white text-black rounded-lg">
			{@render actions?.()}
		</div>
	{/if}
</button>
