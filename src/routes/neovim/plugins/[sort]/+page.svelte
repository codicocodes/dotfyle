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
	import MultiSelectFilter from '$lib/components/MultiSelectFilter.svelte';
	import { navigate } from '$lib/navigate';
	import Accordion from '$lib/components/accordion.svelte';
	import Fa from 'svelte-fa';
	import { faCircleXmark, faFilter } from '@fortawesome/free-solid-svg-icons';
	import NeovimPluginMetaData from '$lib/components/NeovimPluginMetaData.svelte';
	import ShareContainer from '$lib/components/ShareContainer.svelte';
	import PluginSearchNavigation from '$lib/components/PluginSearchNavigation.svelte';
	import Search from '$lib/components/Search.svelte';

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
	/>
</svelte:head>

<div class="w-full flex flex-col items-center px-4">
	<div class="flex flex-col max-w-5xl w-full">
		<div class="flex flex-col w-full items-center my-8 mb-4 gap-4">
			<MediumHeroTitle>
				<CoolText text={data.content.title} />
			</MediumHeroTitle>
			<p class="text-lg">
				{data.content.description}
			</p>
		</div>

		<div class="flex w-full justify-center">
			<ShareContainer
				url={$page.url.origin + $page.url.pathname}
				tweetText={data.content.title}
				emailSubject={data.content.title}
				emailBody={data.content.description}
			/>
		</div>

		<Search placeholder="Search {data.pagination.total} plugins" />
		<div class="flex flex-col w-full items-center my-4 gap-4">
			<div class="flex gap-6 font-medium text-lg">
				{#each data.navigation as nav}
					{#if $page.params.sort === nav.value}
						<a href={nav.path}>
							<button>
								<CoolTextWithChildren>{nav.label}</CoolTextWithChildren>
							</button>
						</a>
					{:else}
						<a href={nav.path}>
							<button>
								<CoolTextOnHover>{nav.label}</CoolTextOnHover>
							</button>
						</a>
					{/if}
				{/each}
			</div>
			<div class="w-full bg-white h-[0.05rem]" />
			<PluginSearchNavigation />
		</div>

		<div class="mb-4">
			<Accordion>
				<div slot="title" class="flex gap-2 items-center text-sm max-w-full">
					<Fa icon={faFilter} size="sm" />
					Filter
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
							class="bg-gray-600 px-2 py-0.5 rounded-full flex gap-2 items-center mt-1"
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
				<div class="flex flex-col gap-2">
					{#each data.plugins as plugin}
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
							/>
						</RepositoryCard>
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
