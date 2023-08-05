<script lang="ts">
	import { page } from '$app/stores';
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import SmallTitle from '$lib/components/SmallTitle.svelte';
	import type { PageData } from './$types';
	import Fa from 'svelte-fa';
	import {
		faFilter,
		faPuzzlePiece,
		faSearch,
		faSeedling,
		faStar
	} from '@fortawesome/free-solid-svg-icons';
	import CoolTextWithChildren from '$lib/components/CoolTextWithChildren.svelte';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import { navigate } from '$lib/navigate';
	import Modal from '$lib/components/Modal.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import Button from '$lib/components/Button.svelte';
	import MultiSelectFilter from '$lib/components/MultiSelectFilter.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { onMount } from 'svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';

	export let data: PageData;

	let search = $page.url.searchParams.get('q') ?? '';

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
	<title>Search and find Neovim configurations</title>
	<OpenGraph
		title="Search and find Neovim configurations"
		url="https://dotfyle.com/configs"
		description="Find the newest Neovim configurations, the ones with the most plugins or with the most GitHub stars. Filter by plugins and language servers."
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
		<div
			class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 sm:mt-4 mb-2 gap-2"
		>
			<SmallTitle title="Find Neovim configs" />
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
							placeholder="search configs"
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
		<div class="flex flex-col gap-2 my-2">
			{#each data.configs as item}
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
					showGithubLink={false}
				/>
			{/each}
		</div>

		<Pagination page={$page} next={data.pagination.next} previous={data.pagination.prev} />
	</div>
</div>
