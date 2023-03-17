<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CoolLink from '$lib/components/CoolLink.svelte';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import NeovimConfigMetaData from '$lib/components/NeovimConfigMetaData.svelte';
	import OuterLayout from '$lib/components/OuterLayout.svelte';
	import PluginList from '$lib/components/PluginList.svelte';
	import { humanizeAbsolute } from '$lib/utils';
	import {
		faChevronRight,
		faPlus,
		faRotate,
		faSearch,
		faX
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { fade, slide } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
	const { config, plugins } = data;
</script>

<OuterLayout>
	<div in:fade class="h-full grid grid-cols-10 gap-4 my-14 mx-8 sm:px-24">
		<div class="col-span-10 lg:col-span-5 flex flex-col gap-2">
			<!-- profile area -->
			<div class="flex items-center justify-between">
				<h3 class="text-lg font-semibold tracking-wide">
					<CoolLink href={`/${config.owner}`} text="profile" />
				</h3>
				<div class="flex items-center gap-1">
					<Button text="follow" icon={faPlus} />
				</div>
			</div>
			<div in:fade class="flex sm:flex-col items-center justify-center gap-2 w-auto">
				<div class="flex flex-col gap-2 w-full">
					<NeovimConfigCard
						repo={config.repo}
						owner={config.owner}
						avatar={config.ownerAvatar}
						initFile={config.initFile}
						root={config.root}
						stars={config.stars.toString()}
						pluginManager={config.pluginManager ?? 'unknown'}
						pluginCount={config.pluginCount.toString()}
					/>
					<div class="flex items-center justify-between">
						<span class="text-sm tracking-wide font-light">
							last synced {humanizeAbsolute(new Date(config.lastSyncedAt))}
						</span>
						<Button text="sync" icon={faRotate} />
					</div>

					<NeovimConfigMetaData
						syncing={false}
						pluginManager={config.pluginManager ?? 'unknown'}
						pluginCount={plugins.length.toString()}
						root={config.root}
						initFile={config.initFile}
						isMonorepo={config.root}
						isFork={config.fork ? 'yes' : 'no'}
					/>

					{#if config.pluginManager}
						<CoolTextOnHover>
							<a
								in:slide
								class="flex w-full items-center justify-between text-md mt-2"
							>
								<div class="flex gap-2 items-center">
									<span class="force-white-text">
										<Fa icon={faSearch} size="xs" />
									</span>
									<span class="flex items-center gap-1 lowercase">
										more configs using {config.pluginManager}
									</span>
								</div>
								<div class="flex gap-4">
									<button
										class="px-4 py-1 rounded bg-white/25 hover:text-opacity-100 hover:bg-white/25 hover:text-white flex items-center justify-end force-white-text"
									>
										<Fa icon={faChevronRight} size="xs" />
									</button>
								</div>
							</a>
						</CoolTextOnHover>
					{/if}
				</div>
			</div>
		</div>
		<!-- user configs -->
		<div class="col-span-10 lg:col-span-5 w-full gap-2 flex flex-col">
			<h3 class="text-lg font-semibold tracking-wide lowercase">
				<span>{plugins.length} plugins installed with {config.pluginManager ?? 'unknown'}</span>
			</h3>
			{#if plugins.length > 0}
				<PluginList {plugins} />
			{:else}
				<GlossyCard>
					<div class="flex items-center gap-2 p-2 font-semibold text-sm">
						<div class="text-red-500">
							<Fa icon={faX} />
						</div>
						no plugins detected
					</div>
				</GlossyCard>
			{/if}
		</div>
	</div>
</OuterLayout>
