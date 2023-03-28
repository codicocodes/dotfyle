<script lang="ts">
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import { page } from '$app/stores';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import NeovimPluginCard from '$lib/components/NeovimPluginCard.svelte';
	import type { NeovimPluginWithCount } from '$lib/server/prisma/neovimplugins/schema';
	import { trpc } from '$lib/trpc/client';
	import {
		faChartSimple,
		faChevronDown,
		faChevronUp,
		faSeedling,
		faX
	} from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import CoolText from '$lib/components/CoolText.svelte';
	import { goto } from '$app/navigation';
	import CoolTextWithChildren from '$lib/components/CoolTextWithChildren.svelte';
	import { fly } from 'svelte/transition';
	import { DoubleBounce } from 'svelte-loading-spinners';

	function navigate(param: string, value: string) {
		$page.url.searchParams.set(param, value);
		goto($page.url.toString(), { keepFocus: true });
	}

	$: selectedCategories =
		$page.url.searchParams.get('categories')?.split(',').filter(Boolean) ?? [];

	$: selectedCategoriesSet = new Set(selectedCategories);

	let plugins: NeovimPluginWithCount[] = [];

	let loading = true;

	let rawSort: string = $page.url.searchParams.get('sort') ?? 'popular';

	let sort: 'popular' | 'new' = rawSort === 'popular' || rawSort === 'new' ? rawSort : 'popular';
	let start: number;
	let end: number;
let search = $page.url.searchParams.get('q') ?? '';
let expantedTags = false;

onMount(async () => {
  const fetchedPlugins = await trpc($page).searchPlugins.query({
    sorting: sort
  });
  loading = false;
  plugins = fetchedPlugins as unknown as NeovimPluginWithCount[];
});

$: availableCategories = Object.entries(
  plugins
    .map((p) => p.category)
    .reduce((countByCategory: Record<string, number>, cat) => {
      const countInThisCategory = countByCategory[cat];
      return { ...countByCategory, [cat]: countInThisCategory ? countInThisCategory + 1 : 1 };
    }, {})
)
  .sort((a, b) => b[1] - a[1])
  .map((c) => c[0]);

$: {
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

<div class="w-full flex flex-col items-center px-8">
<div class="flex flex-col max-w-5xl w-full gap-4">
  <h1
    class="flex items-center justify-center text-2xl h-full font-semibold tracking-wide my-4 sm:my-12"
  >
    <CoolText text="Find neovim plugins" />
  </h1>
  <div class="flex items-center justify-center">
    <input
				bind:value={search}
				class="w-full sm:w-1/2 p-1 sm:p-4 rounded-lg text-black text-lg font-semibold focus:outline-none focus:border-green-500 shadow-xl focus:shadow-green-300/25 focus:ring-1 focus:ring-green-500 bg-white/80"
			/>
		</div>
		<div class="grid grid-cols-10 sm:gap-4 my-2 sm:my-8 max-w-5xl text-xl">
			<div class="col-span-10 sm:col-span-3 flex flex-col gap-2 my-2">
				<GlossyCard>
					<div class="flex flex-col p-4 w-full gap-2">
						<div class="flex gap-2 text-sm font-semibold">
							<button
								on:click={() => {
									sort = 'new';
									navigate('sort', sort);
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
									navigate('sort', sort);
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
						</div>
					</div>
				</GlossyCard>
				<div class="hidden sm:inline">
					<GlossyCard>
						<div class="flex flex-col px-4 py-1 sm:p-4 w-full gap-2">
							<div class="flex text-xs font-semibold gap-2 flex-wrap">
								{#if selectedCategories.length > 0}
									{#each selectedCategories as category}
										<CoolTextWithChildren>
											<button
												class="flex gap-1 items-center bg-white/30 py-1 px-2 rounded font-semibold"
												on:click={() => {
													selectedCategoriesSet.delete(category);
													selectedCategories = [...selectedCategoriesSet];
													navigate('categories', selectedCategories.join(','));
												}}
											>
												<div class="force-white-text">
													<Fa icon={faX} size="xs" />
												</div>
												{category}
											</button>
										</CoolTextWithChildren>
									{/each}
								{:else}
									<div class="font-semibold py-0.5 px-1">plugin categories</div>
								{/if}
							</div>
							<div class="flex flex-wrap gap-1 text-xs mt-2">
								{#if loading}
									<div class="flex w-full items-center justify-center">
										<DoubleBounce color="#15be97" size="18" />
									</div>
								{/if}
								{#each availableCategories
									.filter( (c) => (selectedCategoriesSet.size > 0 ? !selectedCategoriesSet.has(c) : true) )
									.slice(0, expantedTags ? -1 : 20) as currCategory}
									<CoolTextOnHover>
										<button
											in:fly
											class={`py-1 px-2 cursor-pointer rounded bg-white/30 focus:shadow-green-500 font-semibold`}
											on:click={() => {
												selectedCategories.push(currCategory);
												selectedCategories = selectedCategories;
												navigate('categories', selectedCategories.join(','));
											}}
										>
											{currCategory}
										</button>
									</CoolTextOnHover>
								{/each}
							</div>
							{#if !expantedTags}
								<button
									on:click={() => {
										expantedTags = true;
									}}
									class="text-sm w-full font-semibold flex justify-center items-center gap-2"
								>
									see more
									<Fa icon={faChevronDown} />
								</button>
							{:else}
								<button
									on:click={() => {
										expantedTags = false;
									}}
									class="text-sm w-full font-semibold flex justify-center items-center gap-2"
								>
									see less
									<Fa icon={faChevronUp} />
								</button>
							{/if}
						</div>
					</GlossyCard>
				</div>
			</div>
			<div class="col-span-10 sm:col-span-7 flex flex-col gap-2 overscroll-none">
				{#if loading}
					<div
						class="flex flex-col h-[calc(100vh-380px)] sm:h-[calc(100vh-420px)] overscroll-none verflow-auto scrollbar-hide"
					>
						{#each Array(4).fill(null) as _}
							<div in:fly class="my-2">
								<GlossyCard>
									<div class="my-2 py-10 flex w-full items-center justify-center">
										<DoubleBounce color="#15be97" size="18" />
									</div>
								</GlossyCard>
							</div>
						{/each}
					</div>
				{/if}
				{#if !loading}
					<div
						class="flex flex-col h-[calc(100vh-340px)] sm:h-[calc(100vh-420px)] overscroll-none verflow-auto scrollbar-hide"
					>
						<!-- 
              we need to use a virtual list otherwise rerendering is too heavy
              only way i got it to work was with 100vh - 420px to ensure we don't have double scroll y bars
              if improving this ensure that there is not double scrollbars on either mobile or desktop
            -->
						<VirtualList items={filteredPlugins} let:item bind:start bind:end>
							<div class="my-2">
								<NeovimPluginCard
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
				{/if}
			</div>
		</div>
	</div>
</div>
