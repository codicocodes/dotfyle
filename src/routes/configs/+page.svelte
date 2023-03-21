<script lang="ts">
	import { page } from '$app/stores';
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';
	import CoolText from '$lib/components/CoolText.svelte';
	import { fade } from 'svelte/transition';
	import BigGridContainer from '$lib/components/BigGridContainer.svelte';
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import type { NeovimConfigWithMetaData } from '$lib/server/prisma/neovimconfigs/schema';

	let configs: NeovimConfigWithMetaData[] = [];

	let loading = true;

	let search = $page.url.searchParams.get('q') ?? '';

	onMount(async () => {
		const fetchedConfigs = await trpc($page).getConfigs.query();
		loading = false;
		configs = fetchedConfigs as unknown as NeovimConfigWithMetaData[];
	});

	$: filteredConfig = configs.filter((p) => {
		const searchable =
			p.owner +
			p.repo +
      p.root +
      p.initFile +
			p.pluginManager
      + `${p.repo}/${p.root}/${p.initFile}`
      + `${p.repo} ${p.root} ${p.initFile}`



		return searchable.toLowerCase().includes(search.toLowerCase());
	});
</script>

<div class="w-full flex flex-col items-center px-8">
	<div class="flex flex-col max-w-5xl w-full gap-4">
		<h1
			class="flex items-center justify-center text-2xl h-full font-semibold tracking-wide my-4 sm:my-12"
		>
			<CoolText text="Find neovim configs" />
		</h1>
		<div class="flex items-center justify-center mb-8">
			<input
				bind:value={search}
				class="w-full sm:w-1/2 p-4 rounded-lg text-black text-lg font-semibold focus:outline-none focus:border-green-500 shadow-xl focus:shadow-green-300/25 focus:ring-1 focus:ring-green-500 bg-white/80"
			/>
		</div>
		<BigGridContainer>
			{#each filteredConfig as conf}
					<a href={`/${conf.owner}/${conf.slug}`} in:fade>
					<div class="my-2 w-full">
					<NeovimConfigCard
						repo={conf.repo}
						owner={conf.owner}
						avatar={conf.ownerAvatar}
						initFile={conf.initFile}
						root={conf.root}
						stars={conf.stars.toString()}
						pluginManager={conf.pluginManager ?? 'unknown'}
						pluginCount={conf.pluginCount.toString()}
					/>
					</div>
				</a>
			{/each}
		</BigGridContainer>
	</div>
</div>
