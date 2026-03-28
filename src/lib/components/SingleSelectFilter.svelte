<script lang="ts">
	import { faChevronDown, faChevronUp, faX } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	import CoolTextWithChildren from './CoolTextWithChildren.svelte';
	import CoolTextOnHover from './CoolTextOnHover.svelte';
	import { fly } from 'svelte/transition';

	interface Props {
		expandAtCount?: number;
		title: string;
		items: string[];
		selected?: string | null;
	}

	let {
		expandAtCount = 20,
		title,
		items,
		selected = $bindable(null)
	}: Props = $props();

	let filter = $state('');

	let expanded = $state(false);

	function unselectItem() {
		selected = null;
	}

	const dispatch = createEventDispatcher();

	function sendSelectionUpdated() {
		dispatch('updated', {
			selected
		});
	}
</script>

<div class="flex flex-col px-4 py-1 sm:p-4 w-full gap-2">
	<div class="px-1 flex text-xs font-semibold gap-2 flex-wrap">
		{title}
	</div>
	<input
		bind:value={filter}
		placeholder="filter"
		class="px-2 py-1 rounded text-sm text-accent-bright focus:outline-none"
	/>
	<div class="flex flex-wrap gap-1 aext-xs mt-2">
		{#if selected}
			<CoolTextWithChildren>
				<button
					class="flex gap-1 items-center bg-black/30 py-1 px-2 rounded font-semibold"
					onclick={() => unselectItem()}
				>
					<div class="force-white-text">
						<Fa icon={faX} size="xs" />
					</div>
					{selected}
				</button>
			</CoolTextWithChildren>
		{/if}
		{#each items
			.filter((c) => selected !== c)
			.filter((c) => c.toLowerCase().includes(filter.toLowerCase()))
			.slice(0, expanded ? -1 : expandAtCount) as currItem}
			<button
				in:fly|global
				class={`py-1 px-2 cursor-pointer rounded bg-white focus:shadow-main font-medium text-black`}
				onclick={() => {
					selected = currItem;
					sendSelectionUpdated();
				}}
			>
				{currItem}
			</button>
		{/each}

		{#if !expanded}
			<button
				onclick={() => {
					expanded = true;
				}}
				class="text-sm w-full font-semibold flex justify-center items-center gap-2"
			>
				see more
				<Fa icon={faChevronDown} />
			</button>
		{:else}
			<button
				onclick={() => {
					expanded = false;
				}}
				class="text-sm w-full font-semibold flex justify-center items-center gap-2"
			>
				see less
				<Fa icon={faChevronUp} />
			</button>
		{/if}
	</div>
</div>
