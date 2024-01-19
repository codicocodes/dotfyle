<script lang="ts">
	import type { NeovimPluginWithCount } from '$lib/server/prisma/neovimplugins/schema';
	import { faChevronRight, faUserGroup } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import CoolTextOnHover from './CoolTextOnHover.svelte';

	import GlossyCard from './GlossyCard.svelte';
	export let plugins: NeovimPluginWithCount[];

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
					<a
						href={`/plugins/${plugin.owner}/${plugin.name}`}
						class="flex w-full items-center justify-between"
					>
						<span class="flex items-center gap-1 font-semibold text-regular tracking-wide">
							<span class="hidden sm:block">
								{plugin.owner}/{plugin.name}
							</span>
							<span class="block sm:hidden">
								{plugin.name}
							</span>
						</span>
						<div class="flex gap-4">
							{#if plugin.configCount >= 0}
								<p
									title="Users on dotfyle"
									class="hidden sm:flex px-4 py-1 rounded items-center justify-end force-white-text gap-1 font-semibold"
								>
									<Fa icon={faUserGroup} size="xs" />
									{plugin.configCount}
								</p>
							{/if}
							<div class="hidden lg:flex lg:min-w-[150px]" title="Plugin catategory">
								<div
									class="hidden sm:flex px-4 py-1 rounded bg-white/25 hover:text-opacity-100 hover:bg-white/25 hover:text-white items-center justify-end force-white-text"
								>
									{plugin.category}
								</div>
							</div>
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
