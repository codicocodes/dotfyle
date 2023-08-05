<script lang="ts">
	import Fa from 'svelte-fa';
	import GlossyCard from './GlossyCard.svelte';
	import { faCircleChevronDown, faCircleChevronUp } from '@fortawesome/free-solid-svg-icons';
	import { slide } from 'svelte/transition';
	export let open = false;
</script>

<GlossyCard>
	<div class="flex flex-col w-full">
		<div class="p-4 flex flex-col justify-center">
			<button
				on:click={() => (open = !open)}
				class="font-semibold text-xl w-full flex justify-between items-center h-full"
			>
				<slot name="title" />

				<Fa icon={!open ? faCircleChevronDown : faCircleChevronUp} size="sm" />
			</button>
			<slot name="description" />
		</div>
		{#if open}
			<div transition:slide class="w-full">
				<slot name="content" />
			</div>
		{/if}
	</div>
</GlossyCard>
