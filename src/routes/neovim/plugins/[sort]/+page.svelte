<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Pagination from '$lib/components/Pagination.svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';
	import RepositoryCard from '$lib/components/RepositoryCard.svelte';
	import MultiSelectFilter from '$lib/components/MultiSelectFilter.svelte';
	import { navigate } from '$lib/navigate';
	import Accordion from '$lib/components/accordion.svelte';
	import Fa from 'svelte-fa';
	import { faCircleXmark, faFilter } from '@fortawesome/free-solid-svg-icons';
	import NeovimPluginMetaData from '$lib/components/NeovimPluginMetaData.svelte';
	import SearchHeader from '$lib/components/SearchHeader.svelte';
	import PluginSearchNavigation from '$lib/components/PluginSearchNavigation.svelte';

	export let data: PageData;

	$: selectedCategories =
		$page.url.searchParams.get('categories')?.split(',').filter(Boolean) ?? [];

	$: selectedCategoriesSet = new Set(selectedCategories);
</script>

<svelte:head>
	<title>{data.content.ogTitle}</title>
	<OpenGraph
		title={data.content.ogTitle}
		description={data.content.ogDescription}
		url="https://dotfyle.com/neovim/plugins/{$page.params.sort}"
		image={data.content.ogImage}
	/>
</svelte:head>

<div class="w-full flex flex-col items-center px-4">
	<div class="flex flex-col max-w-5xl w-full">
		<div class="flex flex-col gap-2 my-2 mb-4">
			<SearchHeader
				content={data.content}
				navigation={data.navigation}
				placeholder="Search {data.pagination.total} plugins"
			/>
			<PluginSearchNavigation />
		</div>

		<div class="mb-4">
			<Accordion>
				<div slot="title" class="flex gap-2 items-center text-sm max-w-full">
					<Fa icon={faFilter} size="sm" />
					Filter by plugin category
				</div>

				<div slot="description" class="flex text-xs gap-1 flex-wrap">
					{#each Array.from(selectedCategoriesSet) as category}
						<button
							on:click={() => {
								selectedCategoriesSet.delete(category);
								selectedCategoriesSet = selectedCategoriesSet;
								navigate($page, 'page', '1');
								navigate($page, 'categories', Array.from(selectedCategoriesSet).join(','), true);
							}}
							class="bg-white text-black px-2 py-1 rounded-full flex gap-2 items-center mt-1"
						>
							{category}
							<Fa icon={faCircleXmark} size="sm" />
						</button>
					{/each}
				</div>

				<MultiSelectFilter
					slot="content"
					title="plugin categories"
					on:updated={({ detail }) => {
						navigate($page, 'page', '1');
						navigate($page, 'categories', Array.from(detail.selected).join(','), true);
						selectedCategoriesSet = new Set(detail.selected);
					}}
					items={data.categories}
					selected={selectedCategoriesSet}
				/>
			</Accordion>
		</div>

		<div class="grid grid-cols-10 sm:gap-4 max-w-5xl text-xl">
			<div class="col-span-10 sm:col-span-10 flex flex-col gap-2 overscroll-none">
				<ol class="flex flex-col gap-2">
					{#each data.plugins as plugin}
						<li>
							<RepositoryCard
								name="{plugin.owner}/{plugin.name}"
								link="/plugins/{plugin.owner}/{plugin.name}"
								description={plugin.shortDescription}
								thumbnail={plugin.media?.[0]}
							>
								<NeovimPluginMetaData
									slot="footer"
									stars={plugin.stars.toString()}
									configCount={plugin.configCount}
									category={plugin.category}
									addedLastWeek={plugin.addedLastWeek}
								/>
							</RepositoryCard>
						</li>
					{/each}
				</ol>

				<Pagination
					page={$page}
					next={$page.data.pagination.next}
					previous={$page.data.pagination.prev}
				/>
			</div>
		</div>
	</div>
</div>
