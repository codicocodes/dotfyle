<script lang="ts">
	import { page } from '$app/stores';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import NeovimPluginCard from '$lib/components/NeovimPluginCard.svelte';
	import {
		faChartSimple,
		faFilter,
		faFire,
		faSearch,
		faSeedling
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import CoolTextWithChildren from '$lib/components/CoolTextWithChildren.svelte';
	import SmallTitle from '$lib/components/SmallTitle.svelte';
	import type { PageData } from './$types';
	import { navigate } from '$lib/navigate';
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';
	import MultiSelectFilter from '$lib/components/MultiSelectFilter.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';

	export let data: PageData;

	$: selectedCategories =
		$page.url.searchParams.get('categories')?.split(',').filter(Boolean) ?? [];

	let selectedCategoriesSet = new Set(selectedCategories);

	let rawSort: string = $page.url.searchParams.get('sort') ?? 'popular';

	let sort: 'popular' | 'new' | 'trending' =
		rawSort === 'popular' || rawSort === 'new' || rawSort === 'trending' ? rawSort : 'popular';
	let search = $page.url.searchParams.get('q') ?? '';
	$: showFilter = false;
</script>

<svelte:head>
	<title>Search and find Neovim plugins</title>
	<OpenGraph
		title="Search and find Neovim plugins"
		url="https://dotfyle.com/configs"
		description="Find the new, trending and popular Neovim Plugins. Filter by type of plugin."
	/>
</svelte:head>

<Modal showModal={showFilter} onClose={() => (showFilter = false)}>
	<div class="col-span-10 sm:col-span-3 flex flex-col gap-2 my-2">
		<GlossyCard>
			<div class="flex flex-col p-4 w-full gap-2">
				<div class="flex gap-2 text-sm font-semibold">
					<button
						on:click={() => {
							sort = 'new';
							navigate($page, 'page', '1');
							navigate($page, 'sort', sort, true);
						}}
					>
						{#if sort === 'new'}
							<CoolTextWithChildren>
								<div
									class="bg-white/30 flex items-center gap-2 w-full cursor-pointer hover:shadow-sm hover:shadow-green-300/25 px-2 py-1 rounded"
								>
									<div class="flex items-center force-white-text">
										<Fa icon={faSeedling} />
									</div>
									new
								</div>
							</CoolTextWithChildren>
						{:else}
							<CoolTextOnHover>
								<div
									class="bg-white/30 flex items-center gap-2 w-full cursor-pointer hover:shadow-sm hover:shadow-green-300/25 px-2 py-1 rounded"
								>
									<div class="flex items-center force-white-text">
										<Fa icon={faSeedling} />
									</div>
									new
								</div>
							</CoolTextOnHover>
						{/if}
					</button>
					<button
						on:click={() => {
							sort = 'popular';
							navigate($page, 'page', '1');
							navigate($page, 'sort', sort, true);
						}}
					>
						{#if sort === 'popular'}
							<CoolTextWithChildren>
								<div
									class="bg-white/30 flex items-center gap-2 w-full cursor-pointer hover:shadow-sm hover:shadow-green-300/25 px-2 py-1 rounded"
								>
									<div class="flex items-center force-white-text">
										<Fa icon={faChartSimple} />
									</div>
									<span>popular</span>
								</div>
							</CoolTextWithChildren>
						{:else}
							<CoolTextOnHover>
								<div
									class="bg-white/30 flex items-center gap-2 w-full cursor-pointer hover:shadow-sm hover:shadow-green-300/25 px-2 py-1 rounded"
								>
									<div class="flex items-center force-white-text">
										<Fa icon={faChartSimple} />
									</div>
									<span>popular</span>
								</div>
							</CoolTextOnHover>
						{/if}
					</button>
					<button
						on:click={() => {
							sort = 'trending';
							navigate($page, 'page', '1');
							navigate($page, 'sort', sort, true);
						}}
					>
						{#if sort === 'trending'}
							<CoolTextWithChildren>
								<div
									class="bg-white/30 flex items-center gap-2 w-full cursor-pointer hover:shadow-sm hover:shadow-green-300/25 px-2 py-1 rounded"
								>
									<div class="flex items-center force-white-text">
										<Fa icon={faFire} />
									</div>
									trending
								</div>
							</CoolTextWithChildren>
						{:else}
							<CoolTextOnHover>
								<div
									class="bg-white/30 flex items-center gap-2 w-full cursor-pointer hover:shadow-sm hover:shadow-green-300/25 px-2 py-1 rounded"
								>
									<div class="flex items-center force-white-text">
										<Fa icon={faFire} />
									</div>
									trending
								</div>
							</CoolTextOnHover>
						{/if}
					</button>
				</div>
			</div>
		</GlossyCard>
		<div>
			<MultiSelectFilter
				title="plugin categories"
				on:updated={({ detail }) => {
					navigate($page, 'page', '1');
					navigate($page, 'categories', Array.from(detail.selected).join(','), true);
					selectedCategoriesSet = new Set(detail.selected);
				}}
				items={data.categories}
				selected={selectedCategoriesSet}
			/>
		</div>
	</div>
</Modal>
<div class="w-full flex flex-col items-center px-4">
	<div class="flex flex-col max-w-5xl w-full">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 sm:mt-4 mb-2 gap-2">
			<SmallTitle title="Find Neovim plugins" />
			<div class="flex justify-end gap-2 sm:w-1/2">
				<form
					class="grow"
					on:submit|preventDefault={() => {
						navigate($page, 'page', '1');
						navigate($page, 'q', search, true);
					}}
				>
					<div class="flex grow gap-2">
						<input
							bind:value={search}
							placeholder="search plugins"
							class="p-1 sm:p-1 rounded-lg text-black text-sm font-medium focus:outline-none focus:border-green-500 shadow-xl focus:shadow-green-300/25 focus:ring-1 focus:ring-green-500 bg-white/80 w-full"
						/>
						<Button text="Search" loading={false} icon={faSearch} />
					</div>
				</form>
				<Button
					on:click={() => (showFilter = true)}
					text="Filter"
					loading={false}
					icon={faFilter}
				/>
			</div>
		</div>

		<div class="grid grid-cols-10 sm:gap-4 max-w-5xl text-xl">
			<div class="col-span-10 sm:col-span-10 flex flex-col gap-2 overscroll-none">
				<div class="flex flex-col gap-2">
					{#each data.plugins as item}
						<NeovimPluginCard
							size="lg"
							owner={item.owner}
							name={item.name}
							stars={item.stars.toString()}
							configCount={item.configCount}
							category={item.category}
							shortDescription={item.shortDescription}
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
