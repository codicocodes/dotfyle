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
	import { faCircleXmark, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';

	export let data: PageData;

	$: selectedCategories =
		$page.url.searchParams.get('categories')?.split(',').filter(Boolean) ?? [];

	$: selectedCategoriesSet = new Set(selectedCategories);

	let search = $page.url.searchParams.get('q') ?? '';

	let isfocused = false;
  let inputRef: HTMLInputElement
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
		<div class="flex flex-col w-full items-center my-8 mb-4 gap-4">
			<MediumHeroTitle>
				<CoolText text={data.content.title} />
			</MediumHeroTitle>
			<p class="text-lg">
				{data.content.description}
			</p>
		</div>

		<form
			action=""
			class="grow flex justify-center"
			on:submit|preventDefault={() => {
				navigate($page, 'page', '1');
				navigate($page, 'q', search, true);
			}}
		>
			<!-- TODO: move to global search and move to other component-->
			<div
				class="flex gap-2 mb-4 w-full sm:w-3/4 md:w-2/3 xl:w-1/2 items-center p-1 sm:p-1 rounded-full text-black text-sm font-medium focus:outline-none focus:border-green-500 shadow-xl focus:shadow-green-300/25 focus:ring-1 focus:ring-green-500 bg-white/80 w-full {isfocused
					? 'shadow-xl shadow-green-300/25'
					: ''}"
			>
				<Fa icon={faSearch} class="ml-1" />
				<input
          bind:this={inputRef}
					type="search"
					bind:value={search}
					placeholder="search plugins"
					class="w-full bg-transparent focus:outline-none w-full"
					on:focus={() => (isfocused = true)}
					on:blur={() => (isfocused = false)}
				/>
				{#if search}
					<button
						type="button"
						on:click={() => {
							search = '';
							navigate($page, 'q', search, true);
              inputRef.focus()
						}}
					>
						<Fa icon={faCircleXmark} class="mr-1" />
					</button>
				{/if}
			</div>
		</form>
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

		<div class="mb-4">
			<Accordion>
				<div slot="title" class="flex gap-2 items-center text-sm max-w-full inline">
					<Fa icon={faFilter} size="sm" />
					Filter
				</div>

				<div slot="description" class="flex text-xs font-thin gap-1 flex-wrap inline">
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
