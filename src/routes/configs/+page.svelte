<script lang="ts">
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import { page } from '$app/stores';
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import SmallTitle from '$lib/components/SmallTitle.svelte';
	import type { PageData } from './$types';
	import Fa from 'svelte-fa';
	import { faFilter, faPuzzlePiece, faSeedling, faStar } from '@fortawesome/free-solid-svg-icons';
	import CoolTextWithChildren from '$lib/components/CoolTextWithChildren.svelte';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import { navigate } from '$lib/navigate';
	import Modal from '$lib/components/Modal.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import Button from '$lib/components/Button.svelte';
	import MultiSelectFilter from '$lib/components/MultiSelectFilter.svelte';

	export let data: PageData;

	let search = $page.url.searchParams.get('q') ?? '';

	let showFilter = false;

	const sortingOptions = ['new', 'stars', 'plugins'];

	let rawSort: string = $page.url.searchParams.get('sort') ?? 'new';

	let sorting = sortingOptions.includes(rawSort) ? rawSort : 'new';

	$: filteredConfig = data.configs.filter((p) => {
		const searchable =
			p.owner +
			p.repo +
			p.root +
			p.initFile +
			p.pluginManager +
			`${p.repo}/${p.root}/${p.initFile}` +
			`${p.repo} ${p.root} ${p.initFile}`;

		return searchable.toLowerCase().includes(search.toLowerCase());
	});

	$: {
		if (sorting === 'new') {
			data.configs = data.configs.sort((a, b) => {
				if (a.createdAt === b.createdAt) return 0;
				return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1;
			});
		}
		if (sorting === 'stars') {
			data.configs = data.configs.sort((a, b) => {
				return a.stars > b.stars ? -1 : 1;
			});
		}
		if (sorting === 'plugins') {
			data.configs = data.configs.sort((a, b) => {
				return a.pluginCount > b.pluginCount ? -1 : 1;
			});
		}
	}

	$: selectedPlugins = $page.url.searchParams.get('plugins')?.split(',').filter(Boolean) ?? [];

	$: selectedPluginsSet = new Set(selectedPlugins);

	let availablePlugins: string[] = $page.data.plugins;
</script>

<Modal showModal={showFilter} onClose={() => (showFilter = false)}>
	<div class="col-span-10 sm:col-span-3 flex flex-col gap-2 my-2">
		<GlossyCard>
			<div class="flex flex-col p-4 w-full gap-2">
				<div class="flex gap-2 text-sm font-semibold">
					<button
						on:click={() => {
							sorting = 'new';
							navigate($page, 'sort', sorting);
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
							navigate($page, 'sort', sorting);
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
							navigate($page, 'sort', sorting);
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
		</GlossyCard>
		<MultiSelectFilter
			title="plugins"
			on:updated={({ detail }) => {
				navigate($page, 'plugins', Array.from(detail.selected).join(','), true);
				selectedPluginsSet = new Set(detail.selected);
			}}
			items={availablePlugins}
			selected={selectedPluginsSet}
		/>
	</div>
</Modal>
<div class="w-full flex flex-col items-center px-4">
	<div class="flex flex-col max-w-5xl w-full">
		<div class="flex items-center justify-between mt-2 sm:mt-4 mb-2">
			<SmallTitle title="Find Neovim plugins" />
			<div class="flex justify-end gap-2 sm:w-1/2">
				<input
					bind:value={search}
          placeholder="filter configs"
					class="hidden sm:flex p-1 sm:p-1 rounded-lg text-black text-sm font-medium focus:outline-none focus:border-green-500 shadow-xl focus:shadow-green-300/25 focus:ring-1 focus:ring-green-500 bg-white/80 w-full"
				/>
				<Button
					on:click={() => (showFilter = true)}
					text="Filter"
					loading={false}
					icon={faFilter}
				/>
			</div>
		</div>

		<input
			bind:value={search}
      placeholder="filter configs"
			class="flex sm:hidden p-1 sm:p-1 rounded-lg text-black text-sm font-medium focus:outline-none focus:border-green-500 shadow-xl focus:shadow-green-300/25 focus:ring-1 focus:ring-green-500 bg-white/80 w-full"
		/>
		<div class="flex flex-col h-[calc(100vh-220px)] sm:h-[calc(100vh-320px)]">
			<!-- 
          we need to use a virtual list otherwise rerendering is too heavy
          only way i got it to work was with 100vh - 420px to ensure we don't have double scroll y bars
          if improving this ensure that there is not double scrollbars on either mobile or desktop
      -->
			<VirtualList items={filteredConfig} let:item>
				<div class="my-2">
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
				</div>
			</VirtualList>
		</div>
	</div>
</div>
