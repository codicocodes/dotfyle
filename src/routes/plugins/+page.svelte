<script lang="ts">
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import { page } from '$app/stores';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import NeovimPluginCard from '$lib/components/NeovimPluginCard.svelte';
	import type { NeovimPluginWithCount } from '$lib/server/prisma/neovimplugins/schema';
	import { trpc } from '$lib/trpc/client';
	import { faChartSimple, faChevronDown, faSeedling, faX } from '@fortawesome/free-solid-svg-icons';
	import {
		Listbox,
		ListboxButton,
		ListboxOption,
		ListboxOptions
	} from '@rgossiaux/svelte-headlessui';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import CoolText from '$lib/components/CoolText.svelte';
	import { goto } from '$app/navigation';

	$: category = $page.url.searchParams.get('category');

	let plugins: NeovimPluginWithCount[] = [];

	let loading = true;

	let rawSort: string = $page.url.searchParams.get('sort') ?? 'popular';

	let sort: 'popular' | 'new' = rawSort === 'popular' || rawSort === 'new' ? rawSort : 'popular';

	let start: number;
	let end: number;
	let search = '';

	// $: console.log({ start, end });

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
				console.log({ countByCategory, cat });
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
		return (
			searchable.toLowerCase().includes(search.toLowerCase()) && p.category.includes(category ?? '')
		);
	});
</script>

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
				class="w-full sm:w-1/2 p-4 rounded-lg text-black text-sm font-medium focus:outline-none focus:border-green-500 shadow-xl focus:shadow-green-300/25 focus:ring-1 focus:ring-green-500"
			/>
		</div>
		<div class="grid grid-cols-10 sm:gap-4 my-8 sm:my-14 max-w-5xl text-xl">
			<div class="col-span-10 sm:col-span-3 flex flex-col gap-2 my-2">
				<GlossyCard>
					<div class="flex flex-col px-4 py-1 sm:p-4 w-full gap-2">
						<Listbox
							value={'popular'}
							on:change={(e) => {
								sort = e.detail;
								$page.url.searchParams.set('sort', sort);
								goto($page.url.toString());

								// let rawSort: string = $page.url.searchParams.get('sort') ?? 'popular';
								// TODO: mutate query string
							}}
						>
							<ListboxButton class="w-full flex items-center"
								><div
									class="flex w-full items-center justify-between gap-2 font-semibold text-sm hover:cursor-pointer"
								>
									<div class="flex gap-2 items-center">
										{#if sort === 'new'}
											<Fa icon={faSeedling} />
										{:else}
											<Fa icon={faChartSimple} />
										{/if}
										{sort}
									</div>
									<Fa icon={faChevronDown} />
								</div>
							</ListboxButton>
							<ListboxOptions
								><div class="flex gap-2 mt-2 text-sm">
									<ListboxOption value={'new'}>
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
									</ListboxOption>
									<ListboxOption value={'popular'}>
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
									</ListboxOption>
								</div></ListboxOptions
							>
						</Listbox>
					</div>
				</GlossyCard>
				<div class="hidden sm:inline">
					<GlossyCard>
						<div class="flex flex-col px-4 py-1 sm:p-4 w-full gap-2">
							<Listbox
								value={''}
								on:change={(e) => {
									category = e.detail;
									$page.url.searchParams.set('category', category ?? '');
									goto($page.url.toString());
								}}
							>
								<div class="flex text-sm font-medium">
									{#if category}
										<button
											class="flex gap-1 items-center bg-white/30 py-0.5 px-1 rounded"
											on:click={() => {
												category = '';
											}}
										>
											<Fa icon={faX} size="xs" />
											{category}
										</button>
									{:else}
                  <div class="font-semibold">
										plugin categories
                  </div>
									{/if}
									<ListboxButton
										class="w-full flex flex-wrap items-center justify-end gap-2 font-semibold text-sm"
									>
										<!--         <button> -->
										<!-- <Fa icon={faChevronDown} /> -->
										<!--         </button> -->
									</ListboxButton>
								</div>
								<ListboxOptions static>
									<div class="flex flex-wrap gap-1 text-xs mt-2">
										{#each availableCategories.slice(0, 50) as currCategory}
											<ListboxOption
												value={currCategory}
												class={({ active }) => {
													return active ? 'shadow-lg shadow-green-500' : '';
												}}
											>
												<button
													class={`py-1 px-1 cursor-pointer rounded bg-white/50 focus:shadow-green-500`}
												>
													{currCategory}
												</button>
											</ListboxOption>
										{/each}
									</div>
								</ListboxOptions>
							</Listbox>
						</div>
					</GlossyCard>
				</div>
			</div>
			<div class="col-span-10 sm:col-span-7 flex flex-col gap-2 overscroll-none">
				{#if !loading}
					<div
						class="flex flex-col h-[calc(100vh-420px)] overscroll-none verflow-auto scrollbar-hide"
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
