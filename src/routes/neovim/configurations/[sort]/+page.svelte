<script lang="ts">
	import { page } from '$app/stores';
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import type { PageData } from './$types';
	import Fa from 'svelte-fa';
	import {
		faCircleXmark,
		faFilter,
		faPuzzlePiece,
		faSeedling,
		faStar
	} from '@fortawesome/free-solid-svg-icons';
	import CoolTextWithChildren from '$lib/components/CoolTextWithChildren.svelte';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import { navigate } from '$lib/navigate';
	import Modal from '$lib/components/Modal.svelte';
	import MultiSelectFilter from '$lib/components/MultiSelectFilter.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { onMount } from 'svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';
	import SearchHeader from '$lib/components/SearchHeader.svelte';
	import Accordion from '$lib/components/accordion.svelte';
	import PluginSearchNavigation from '$lib/components/PluginSearchNavigation.svelte';

	export let data: PageData;

	let showFilter = false;

	const sortingOptions = ['new', 'stars', 'plugins'];

	let rawSort: string = $page.url.searchParams.get('sort') ?? 'new';

	let sorting = sortingOptions.includes(rawSort) ? rawSort : 'new';

	$: selectedPlugins = $page.url.searchParams.get('plugins')?.split(',').filter(Boolean) ?? [];

	$: selectedPluginsSet = new Set(selectedPlugins);

	$: selectedLanguageServers =
		$page.url.searchParams.get('languageservers')?.split(',').filter(Boolean) ?? [];

	$: selectedLanguageServersSet = new Set(selectedLanguageServers);

	let availablePlugins: string[] = [];
	let languageServers: string[] = [];

	onMount(() => {
		data.filter.languageServers.then((ls) => (languageServers = ls));
		data.filter.plugins.then((plugins) => (availablePlugins = plugins));
	});
</script>

<svelte:head>
	<title>{data.content.ogTitle}</title>
	<OpenGraph
		title={data.content.ogTitle}
		description={data.content.ogDescription}
		url="https://dotfyle.com/neovim/plugins/{$page.params.sort}"
	/>
</svelte:head>

<Modal showModal={showFilter} onClose={() => (showFilter = false)}>
	<div class="col-span-10 sm:col-span-3 flex flex-col gap-2 my-2">
		<div class="flex flex-col p-4 w-full gap-2">
			<div class="flex gap-2 text-sm font-semibold">
				<button
					on:click={() => {
						sorting = 'new';
						navigate($page, 'sort', sorting, true);
					}}
				>
					{#if sorting === 'new'}
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
						sorting = 'stars';
						navigate($page, 'page', '1');
						navigate($page, 'sort', sorting, true);
					}}
				>
					{#if sorting === 'stars'}
						<CoolTextWithChildren>
							<div
								class="bg-white/30 flex items-center gap-2 w-full cursor-pointer hover:shadow-sm hover:shadow-green-300/25 px-2 py-1 rounded"
							>
								<div class="flex items-center force-white-text">
									<Fa icon={faStar} />
								</div>
								<span>stars</span>
							</div>
						</CoolTextWithChildren>
					{:else}
						<CoolTextOnHover>
							<div
								class="bg-white/30 flex items-center gap-2 w-full cursor-pointer hover:shadow-sm hover:shadow-green-300/25 px-2 py-1 rounded"
							>
								<div class="flex items-center force-white-text">
									<Fa icon={faStar} />
								</div>
								<span>stars</span>
							</div>
						</CoolTextOnHover>
					{/if}
				</button>
				<button
					on:click={() => {
						sorting = 'plugins';
						navigate($page, 'page', '1');
						navigate($page, 'sort', sorting, true);
					}}
				>
					{#if sorting === 'plugins'}
						<CoolTextWithChildren>
							<div
								class="bg-white/30 flex items-center gap-2 w-full cursor-pointer hover:shadow-sm hover:shadow-green-300/25 px-2 py-1 rounded"
							>
								<div class="flex items-center force-white-text">
									<Fa icon={faPuzzlePiece} />
								</div>
								plugins
							</div>
						</CoolTextWithChildren>
					{:else}
						<CoolTextOnHover>
							<div
								class="bg-white/30 flex items-center gap-2 w-full cursor-pointer hover:shadow-sm hover:shadow-green-300/25 px-2 py-1 rounded"
							>
								<div class="flex items-center force-white-text">
									<Fa icon={faPuzzlePiece} />
								</div>
								plugins
							</div>
						</CoolTextOnHover>
					{/if}
				</button>
			</div>
		</div>

		<MultiSelectFilter
			title="plugins"
			on:updated={({ detail }) => {
				navigate($page, 'page', '1');
				navigate($page, 'plugins', Array.from(detail.selected).join(','), true);
				selectedPluginsSet = new Set(detail.selected);
			}}
			items={availablePlugins}
			selected={selectedPluginsSet}
		/>
		<MultiSelectFilter
			expandAtCount={35}
			title="language servers"
			on:updated={({ detail }) => {
				navigate($page, 'page', '1');
				navigate($page, 'languageservers', Array.from(detail.selected).join(','), true);
				selectedLanguageServersSet = new Set(detail.selected);
			}}
			items={languageServers}
			selected={selectedLanguageServersSet}
		/>
	</div>
</Modal>
<div class="w-full flex flex-col items-center px-4">
	<div class="flex flex-col max-w-5xl w-full">
		<div class="flex flex-col mb-2">
		<div class="flex flex-col gap-2 my-2 mb-4">
			<SearchHeader
				content={data.content}
				navigation={data.navigation}
				placeholder="Search {data.pagination.total} configurations"
			/>
			<PluginSearchNavigation />
		</div>
			<Accordion>
				<div slot="title" class="flex gap-2 items-center text-sm max-w-full">
					<Fa icon={faFilter} size="sm" />
					Filter
				</div>

				<div slot="description" class="flex text-xs gap-1 flex-wrap">
					{#each Array.from(selectedPluginsSet) as plugin}
						<button
							on:click={() => {
								selectedPluginsSet.delete(plugin);
								selectedPluginsSet = selectedPluginsSet;
								navigate($page, 'page', '1');
								navigate($page, 'plugins', Array.from(selectedPluginsSet).join(','), true);
							}}
							class="bg-gray-600 px-2 py-0.5 rounded-full flex gap-2 items-center mt-1"
						>
							{plugin}
							<Fa icon={faCircleXmark} size="sm" />
						</button>
					{/each}
					{#each Array.from(selectedLanguageServersSet) as server}
						<button
							on:click={() => {
								selectedLanguageServersSet.delete(server);
								selectedLanguageServersSet = selectedLanguageServersSet;
								navigate($page, 'page', '1');
								navigate(
									$page,
									'languageservers',
									Array.from(selectedLanguageServersSet).join(','),
									true
								);
							}}
							class="bg-gray-600 px-2 py-0.5 rounded-full flex gap-2 items-center mt-1"
						>
							{server}
							<Fa icon={faCircleXmark} size="sm" />
						</button>
					{/each}
				</div>

				<div slot="content" class="flex flex-col">
					<MultiSelectFilter
						title="Plugins"
						on:updated={({ detail }) => {
							navigate($page, 'page', '1');
							navigate($page, 'plugins', Array.from(detail.selected).join(','), true);
							selectedPluginsSet = new Set(detail.selected);
						}}
						items={availablePlugins}
						selected={selectedPluginsSet}
					/>

					<MultiSelectFilter
						title="Language Servers"
						on:updated={({ detail }) => {
							navigate($page, 'page', '1');
							navigate($page, 'languageservers', Array.from(detail.selected).join(','), true);
							selectedLanguageServersSet = new Set(detail.selected);
						}}
						items={languageServers}
						selected={selectedLanguageServersSet}
					/>
				</div>
			</Accordion>
		</div>
		<ol class="flex flex-col gap-2 my-2">
			{#each data.configs as item}
				<li>
					<NeovimConfigCard
						slug={item.slug}
						repo={item.repo}
						owner={item.owner}
						avatar={item.ownerAvatar}
						initFile={item.initFile}
						root={item.root}
						stars={item.stars.toString()}
						pluginManager={item.pluginManager ?? 'unknown'}
						pluginCount={item.pluginCount.toString()}
						loc={item.linesOfCode}
					/>
				</li>
			{/each}
		</ol>

		<Pagination page={$page} next={data.pagination.next} previous={data.pagination.prev} />
	</div>
</div>
