<script lang="ts">
	import { faArrowRight, faChevronRight, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
	import type { NeovimPlugin } from '@prisma/client';
	import Fa from 'svelte-fa';
	import { fly, slide } from 'svelte/transition';
	import CoolText from './CoolText.svelte';

	import GlossyCard from './GlossyCard.svelte';
	export let plugins: NeovimPlugin[];

	$: sorted = plugins.sort((a, b) => {
		if (a.category === b.category) return 0;
		return a.category > b.category ? 1 : -1;
	});
</script>

<div>
	{#if plugins.length > 0}
		<div class="flex items-center justify-between">
			<h3 class="flex items-center gap-1 text-sm tracking-wide font-semibold pl-1 mb-2">
				<Fa icon={faPuzzlePiece} />
				plugins
			</h3>
		</div>
		<GlossyCard>
			<div class="flex flex-col p-2 text-sm tracking-tight w-full gap-2">
				{#each sorted as plugin, _}
					<div in:slide class="flex w-full items-center justify-between">
						<span class="flex items-center gap-1">
							{plugin.name}
						</span>
            <div class="flex gap-4">
						<span class="hidden sm:inline flex items-center gap-1">
							{plugin.category}
						</span>
						<button class="px-4 py-1 rounded bg-white/25 flex items-center justify-end">
							<Fa icon={faChevronRight} size="xs" />
						</button>
            </div>
					</div>
				{/each}
			</div>
		</GlossyCard>
	{/if}
</div>
