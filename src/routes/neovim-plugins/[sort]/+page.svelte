<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Pagination from '$lib/components/Pagination.svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';
	import RepositoryCard from '$lib/components/RepositoryCard.svelte';
	import MediumHeroTitle from '$lib/components/MediumHeroTitle.svelte';
	import CoolText from '$lib/components/CoolText.svelte';
	import CoolTextWithChildren from '$lib/components/CoolTextWithChildren.svelte';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Search and find Neovim plugins</title>
	<OpenGraph
		title="Search and find Neovim plugins"
		url="https://dotfyle.com/plugins"
		description="Find the new, trending and popular Neovim Plugins. Filter by type of plugin."
	/>
</svelte:head>

<div class="w-full flex flex-col items-center px-4">
	<div class="flex flex-col max-w-5xl w-full">
		<div class="flex flex-col w-full items-center my-8 gap-4">
			<MediumHeroTitle>
				<CoolText text={data.content.title} />
			</MediumHeroTitle>
			<p class="text-lg">
				{data.content.description}
			</p>
		</div>
		<div class="flex flex-col w-full items-center my-4 gap-4">
			<div class="flex gap-6 font-medium text-lg">
				{#each data.navigation as nav}
					{#if $page.params.sort === nav.value}
						<a href={nav.path}>
							<CoolTextWithChildren>{nav.label}</CoolTextWithChildren>
						</a>
					{:else}
						<a href={nav.path}>
							<CoolTextOnHover>{nav.label}</CoolTextOnHover>
						</a>
					{/if}
				{/each}
			</div>
			<div class="w-full bg-white h-[0.05rem]" />
		</div>

		<div class="grid grid-cols-10 sm:gap-4 max-w-5xl text-xl">
			<div class="col-span-10 sm:col-span-10 flex flex-col gap-2 overscroll-none">
				<div class="flex flex-col gap-2">
					{#each data.plugins as item}
						<RepositoryCard
							username={item.owner}
							name={item.name}
							stars={item.stars.toString()}
							configCount={item.configCount}
							category={item.category}
							description={item.shortDescription}
							thumbnail={item.media?.[0]}
						/>
					{/each}
				</div>
				<Pagination
					page={$page}
					next={$page.data.pagination.next}
					previous={$page.data.pagination.prev}
				/>
			</div>
		</div>
	</div>
</div>
