<script lang="ts">
	import { faChevronDown, faChevronUp, faX } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	import CoolTextWithChildren from './CoolTextWithChildren.svelte';
	import CoolTextOnHover from './CoolTextOnHover.svelte';
	import { fly } from 'svelte/transition';

	export let expandAtCount = 20;
	export let title: string;
	export let items: string[];
	export let selected: Set<string>;

	let filter = '';

	let expanded = false;

	function unselectItem(item: string) {
		selected.delete(item);
		sendSelectionUpdated();
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
	<input bind:value={filter} placeholder="filter" class="px-2 py-1 rounded text-sm text-base-600" />
	<div class="flex flex-wrap gap-1 text-xs mt-2">
		{#each items
			.filter((c) => (selected.size > 0 ? !selected.has(c) : true))
			.filter((c) => c.includes(filter))
			.slice(0, expanded ? -1 : expandAtCount) as currItem}
			<CoolTextOnHover>
				<button
					in:fly
					class={`py-1 px-2 cursor-pointer rounded bg-white/30 focus:shadow-primary-500 font-medium`}
					on:click={() => {
						selected.add(currItem);
						selected = selected;
						sendSelectionUpdated();
					}}
				>
					{currItem}
				</button>
			</CoolTextOnHover>
		{/each}

		{#if !expanded}
			<button
				on:click={() => {
					expanded = true;
				}}
				class="text-sm w-full font-semibold flex justify-center items-center gap-2"
			>
				see more
				<Fa icon={faChevronDown} />
			</button>
		{:else}
			<button
				on:click={() => {
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
