<script lang="ts">
	import { faChevronRight, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
	import type { NeovimPlugin } from '@prisma/client';
	import Fa from 'svelte-fa';
	import CoolTextOnHover from './CoolTextOnHover.svelte';

	import GlossyCard from './GlossyCard.svelte';
	export let plugins: NeovimPlugin[];

	$: sorted = plugins.sort((a, b) => {
		if (a.category === b.category) return 0;
		return a.category > b.category ? 1 : -1;
	});
</script>

<div>
		<GlossyCard>
			<div class="flex flex-col p-2 text-sm tracking-tight w-full gap-2">
				{#each sorted as plugin, _}
					<CoolTextOnHover>
						<a href={`/plugins/${plugin.owner}/${plugin.name}`} class="flex w-full items-center justify-between">
							<span class="flex items-center gap-1 font-medium text-regular tracking-wide">
								{plugin.name}
							</span>
							<div class="flex gap-4">
								<button
									class="px-4 py-1 rounded bg-white/25 hover:text-opacity-100 hover:bg-white/25 hover:text-white flex items-center justify-end force-white-text"
								>
									<Fa icon={faChevronRight} size="xs" />
								</button>
							</div>
						</a>
					</CoolTextOnHover>
				{/each}
			</div>
		</GlossyCard>
</div>

<style>
</style>
