<script lang="ts">
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import { page } from '$app/stores';
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import SmallTitle from '$lib/components/SmallTitle.svelte';
	import type { PageData } from './$types';
	import {
		Listbox,
		ListboxButton,
		ListboxOption,
		ListboxOptions
	} from '@rgossiaux/svelte-headlessui';
	import Fa from 'svelte-fa';
	import {
		faPuzzlePiece,
		faSeedling,
		faStar,
		type IconDefinition
	} from '@fortawesome/free-solid-svg-icons';
	import CoolTextWithChildren from '$lib/components/CoolTextWithChildren.svelte';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import { navigate } from '$lib/navigate';

	export let data: PageData;

	let search = $page.url.searchParams.get('q') ?? '';

	const sortingOptions = ['new', 'stars', 'plugins'];

	let rawSort: string = $page.url.searchParams.get('sort') ?? 'new';

	let sorting = sortingOptions.includes(rawSort) ? rawSort : 'new';

	const sortingIcons: Record<string, IconDefinition> = {
		new: faSeedling,
		stars: faStar,
		plugins: faPuzzlePiece
	} as const;

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
</script>

<div class="w-full flex flex-col items-center px-8">
	<div class="flex flex-col max-w-5xl w-full gap-4">
		<SmallTitle title="Find Neovim configs" />
		<div class="flex items-center justify-center mb-4 gap-2">
			<input
				bind:value={search}
				class="w-full sm:w-1/2 p-1 sm:p-2 rounded-lg text-black text-lg font-semibold focus:outline-none focus:border-green-500 shadow-xl focus:shadow-green-300/25 focus:ring-1 focus:ring-green-500 bg-white/80"
			/>
			<Listbox
				class="relative h-full"
				value={sorting}
				on:change={(e) => {
					sorting = e.detail;
					navigate($page, 'sort', sorting);
				}}
			>
				<ListboxButton class="flex gap-1 w-24">
					<div
						class="bg-white/30 flex items-center gap-2 w-full cursor-pointer hover:shadow-sm hover:shadow-green-300/25 p-2 sm:py-2 rounded sm:font-semibold"
					>
						<div class="flex items-center force-white-text">
							<Fa size="xs" icon={sortingIcons[sorting]} />
						</div>
						{sorting}
					</div>
				</ListboxButton>
				<ListboxOptions class="sm:w-24 absolute flex flex-col gap-2 mt-2 z-10">
					{#each sortingOptions as option}
						<ListboxOption value={option} class="bg-gray-700 rounded">
							{#if option === sorting}
								<CoolTextWithChildren>
									<div
										class="cursor-pointer bg-white/30 flex items-center gap-2 w-full cursor-pointer hover:shadow-sm hover:shadow-green-300/25 px-2 py-1 rounded font-semibold"
									>
										<div class="flex items-center force-white-text">
											<Fa size="xs" icon={sortingIcons[option]} />
										</div>
										{option}
									</div>
								</CoolTextWithChildren>
							{:else}
								<CoolTextOnHover>
									<div
										class="bg-white/30 flex items-center gap-2 w-full cursor-pointer hover:shadow-sm hover:shadow-green-300/25 px-2 py-1 rounded"
									>
										<div class="flex items-center force-white-text">
											<Fa size="xs" icon={sortingIcons[option]} />
										</div>
										<span>{option}</span>
									</div>
								</CoolTextOnHover>
							{/if}
						</ListboxOption>
					{/each}
				</ListboxOptions>
			</Listbox>
		</div>
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
