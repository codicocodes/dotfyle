<script lang="ts">
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import { page } from '$app/stores';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import NeovimPluginCard from '$lib/components/NeovimPluginCard.svelte';
	import type { NeovimPluginWithCount } from '$lib/server/prisma/neovimplugins/schema';
	import {
		faChartSimple,
		faChevronDown,
		faChevronUp,
		faFilter,
		faFire,
		faSeedling
	} from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import CoolTextWithChildren from '$lib/components/CoolTextWithChildren.svelte';
	import SmallTitle from '$lib/components/SmallTitle.svelte';
	import type { PageData } from './$types';
	import { navigate } from '$lib/navigate';
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';
	import MultiSelectFilter from '$lib/components/MultiSelectFilter.svelte';

	$: selectedCategories =
		$page.url.searchParams.get('categories')?.split(',').filter(Boolean) ?? [];

	let selectedCategoriesSet = new Set(selectedCategories);

	let plugins: NeovimPluginWithCount[] = [];

	let rawSort: string = $page.url.searchParams.get('sort') ?? 'popular';

	let sort: 'popular' | 'new' | 'trending' =
		rawSort === 'popular' || rawSort === 'new' || rawSort === 'trending' ? rawSort : 'popular';
	let search = $page.url.searchParams.get('q') ?? '';
	let expantedTags = false;
	let availableCategories: string[] = [];
	$: showFilter = false;

	export let data: PageData;

	onMount(async () => {
		plugins = data.plugins;
		availableCategories = Object.entries(
			plugins.reduce((countByCategory: Record<string, number>, p) => {
				const cat = p.category;
				const countInThisCategory = countByCategory[cat];
				return { ...countByCategory, [cat]: countInThisCategory ? countInThisCategory + 1 : 1 };
			}, {})
		)
			.sort((a, b) => b[1] - a[1])
			.map((c) => c[0]);
	});

	$: {
		if (sort === 'trending') {
			plugins = plugins.sort((a, b) => {
				if (a.addedLastWeek === b.addedLastWeek) return 0;
				return a.addedLastWeek > b.addedLastWeek ? -1 : 1;
			});
		}
		if (sort === 'new') {
			plugins = plugins.sort((a, b) => {
				if (a.createdAt === b.createdAt) return 0;
				return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1;
			});
		}
		if (sort === 'popular') {
			plugins = plugins.sort((a, b) => {
				if (a.configCount === b.configCount) return a.stars > b.stars ? -1 : 1;
				return a.configCount > b.configCount ? -1 : 1;
			});
		}
	}

	$: filteredPlugins = plugins.filter((p) => {
		const searchable =
			p.owner +
			p.name +
			p.shortDescription +
			p.category +
			`${p.owner}/${p.name}` +
			p.category.split('-').join(' ');

		if (selectedCategoriesSet.size > 0) {
			if (!selectedCategoriesSet.has(p.category)) {
				return false;
			}
		}
		return searchable.toLowerCase().includes(search.toLowerCase());
	});
</script>

<svelte:head>
	<title>Search and find neovim plugins</title>
</svelte:head>

<Modal showModal={showFilter} onClose={() => (showFilter = false)}>
	<div class="col-span-10 sm:col-span-3 flex flex-col gap-2 my-2">
		<GlossyCard>
			<div class="flex flex-col p-4 w-full gap-2">
				<div class="flex gap-2 text-sm font-semibold">
					<button
						on:click={() => {
							sort = 'new';
							navigate($page, 'sort', sort);
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
							navigate($page, 'sort', sort);
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
							navigate($page, 'sort', sort);
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
			<GlossyCard>
				<div class="flex flex-col px-4 py-1 sm:p-4 w-full gap-2">
					<div class="font-semibold py-0.5 px-1 flex text-xs font-semibold gap-2 flex-wrap">
						plugin categories
					</div>
					<MultiSelectFilter
						on:updated={({ detail }) => {
							console.log(detail.selected);
							navigate($page, 'categories', Array.from(detail.selected).join(','));
              selectedCategoriesSet = new Set(detail.selected)
						}}
						items={availableCategories}
						selected={selectedCategoriesSet}
					/>
				</div>
			</GlossyCard>
		</div>
	</div>
</Modal>
<div class="w-full flex flex-col items-center px-8">
	<div class="flex flex-col max-w-5xl w-full gap-4">
		<SmallTitle title="Find Neovim plugins" />
		<div class="flex items-center justify-center gap-2">
			<input
				bind:value={search}
				class="w-full sm:w-1/2 p-1 sm:p-1 rounded-lg text-black text-lg font-medium focus:outline-none focus:border-green-500 shadow-xl focus:shadow-green-300/25 focus:ring-1 focus:ring-green-500 bg-white/80"
			/>
			<Button on:click={() => (showFilter = true)} text="Filter" loading={false} icon={faFilter} />
		</div>
		<div class="grid grid-cols-10 sm:gap-4 my-2 sm:my-4 max-w-5xl text-xl">
			<div class="col-span-10 sm:col-span-10 flex flex-col gap-2 overscroll-none">
				<div class="flex flex-col h-[calc(100vh-340px)] sm:h-[calc(100vh-320px)]">
					<!-- 
              we need to use a virtual list otherwise rerendering is too heavy
              only way i got it to work was with 100vh - 420px to ensure we don't have double scroll y bars
              if improving this ensure that there is not double scrollbars on either mobile or desktop
            -->
					<VirtualList items={filteredPlugins} let:item>
						<div class="my-2">
							<NeovimPluginCard
								size="lg"
								owner={item.owner}
								name={item.name}
								stars={item.stars.toString()}
								configCount={item.configCount}
								category={item.category}
								shortDescription={item.shortDescription}
							/>
						</div>
					</VirtualList>
				</div>
			</div>
		</div>
	</div>
</div>
