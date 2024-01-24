<script>
	import { faEllipsisVertical, faSync } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	let isOpen = false;
</script>

<button
	class="w-10 h-10 rounded-full flex items-center justify-center relative border-[1px] border-transparent hover:border-secondary"
	on:click={() => (isOpen = !isOpen)}
>
	<Fa icon={faEllipsisVertical} />
	{#if isOpen}
		<div class="absolute top-10 right-0 z-50 bg-white text-black rounded-lg">
			<slot name="actions" />
		</div>
	{/if}
</button>
