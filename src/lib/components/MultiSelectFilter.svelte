<script lang="ts">
	import { faChevronDown, faChevronUp, faX } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	import CoolTextWithChildren from './CoolTextWithChildren.svelte';
	import CoolTextOnHover from './CoolTextOnHover.svelte';
	import { fly } from 'svelte/transition';

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

<input bind:value={filter} placeholder="filter" class="px-2 py-1 rounded text-sm text-gray-600" />
<div class="flex flex-wrap gap-1 text-xs mt-2">
	{#each Array.from(selected) as item}
		<CoolTextWithChildren>
			<button
				class="flex gap-1 items-center bg-white/30 py-1 px-2 rounded font-semibold"
				on:click={() => unselectItem(item)}
			>
				<div class="force-white-text">
					<Fa icon={faX} size="xs" />
				</div>
				{item}
			</button>
		</CoolTextWithChildren>
	{/each}
	{#each items
		.filter((c) => (selected.size > 0 ? !selected.has(c) : true))
    .filter(c => c.includes(filter))
		.slice(0, expanded ? -1 : 20) as currItem}
		<CoolTextOnHover>
			<button
				in:fly
				class={`py-1 px-2 cursor-pointer rounded bg-white/30 focus:shadow-green-500 font-semibold`}
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
