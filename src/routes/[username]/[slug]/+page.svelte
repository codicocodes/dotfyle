<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import CoolTextWithChildren from '$lib/components/CoolTextWithChildren.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import NeovimConfigMetaData from '$lib/components/NeovimConfigMetaData.svelte';
	import NeovimPluginCard from '$lib/components/NeovimPluginCard.svelte';
	import OuterLayout from '$lib/components/OuterLayout.svelte';
	import PluginList from '$lib/components/PluginList.svelte';
	import ShareConfig from '$lib/components/ShareConfig.svelte';
	import { trpc } from '$lib/trpc/client';
	import { hasBeenOneDay, humanizeAbsolute } from '$lib/utils';
	import { faChevronRight, faRotate, faSearch, faUser, faX } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { fade, slide } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ config, plugins, me } = data);

	let syncing = false;

	async function syncConfig() {
		syncing = true;
		const { plugins: syncedPlugins, ...syncedConfig } = await trpc(
			$page
		).syncExistingNeovimConfig.query({
			owner: config.owner,
			slug: config.slug
		});

		const pluginCount = syncedPlugins.length;
		const syncedConfigWithMeta = {
			...syncedConfig,
			ownerAvatar: config.ownerAvatar,
			createdAt: new Date(syncedConfig.createdAt),
			lastSyncedAt: new Date(syncedConfig.lastSyncedAt),
			pluginCount
		};
		config = syncedConfigWithMeta;
		plugins = plugins;
		syncing = false;
		invalidate(() => true);
	}
</script>

<svelte:head>
	<title>{config.owner}/{config.repo}{config.root ? `/${config.root}` : ''}: neovim config</title>
</svelte:head>

<OuterLayout>
	<div in:fade class="h-full flex flex-col gap-4 my-14 mx-4 sm:mx-8 lg:px-24">
		<div class="flex flex-col gap-2">
			<!-- profile area -->
			<div class="flex items-center justify-end gap-2">

				<ShareConfig owner={config.owner} slug={config.slug} />
				<a href={`/${config.owner}`} class=" bg-gray-700 p-2 rounded">
					<CoolTextWithChildren>
						<div class="flex flex-row gap-2">
							<div class="flex items-center force-white-text">
								<Fa icon={faUser} />
							</div>
							<span class="font-semibold">profile</span>
						</div>
					</CoolTextWithChildren>
				</a>
			
			</div>
			<div in:fade class="flex sm:flex-col items-center justify-center gap-2 w-auto">
				<div class="flex flex-col gap-2 w-full">
					<NeovimConfigCard
						slug={config.slug}
						repo={config.repo}
						owner={config.owner}
						avatar={config.ownerAvatar}
						initFile={config.initFile}
						root={config.root}
						stars={config.stars.toString()}
						pluginManager={config.pluginManager ?? 'unknown'}
						pluginCount={config.pluginCount.toString()}
						showGithubLink={true}
					/>

					<NeovimConfigMetaData
						{syncing}
						pluginManager={config.pluginManager ?? 'unknown'}
						pluginCount={plugins.length.toString()}
						root={config.root}
						initFile={config.initFile}
						isMonorepo={config.root ? 'yes' : 'no'}
						isFork={config.fork ? 'yes' : 'no'}
            leaderkey="unknown"
					/>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
						<CoolTextOnHover>
							<GlossyCard>
								<a href="/plugins" class="p-2 flex w-full items-center justify-between text-md">
									<div class="flex gap-2 items-center">
										<span class="force-white-text">
											<Fa icon={faSearch} size="xs" />
										</span>
										<span class="flex items-center gap-1 lowercase"> find neovim plugins </span>
									</div>
									<div class="flex gap-4">
										<button
											class="px-4 py-1 rounded bg-white/25 hover:text-opacity-100 hover:bg-white/25 hover:text-white flex items-center justify-end force-white-text"
										>
											<Fa icon={faChevronRight} size="xs" />
										</button>
									</div>
								</a>
							</GlossyCard>
						</CoolTextOnHover>

						<CoolTextOnHover>
							<GlossyCard>
								<a
									href="/configs"
									in:slide
									class="p-2 flex w-full items-center justify-between text-md"
								>
									<div class="flex gap-2 items-center">
										<span class="force-white-text">
											<Fa icon={faSearch} size="xs" />
										</span>
										<span class="flex items-center gap-1 lowercase"> find neovim configs </span>
									</div>
									<div class="flex gap-4">
										<button
											class="px-4 py-1 rounded bg-white/25 hover:text-opacity-100 hover:bg-white/25 hover:text-white flex items-center justify-end force-white-text"
										>
											<Fa icon={faChevronRight} size="xs" />
										</button>
									</div>
								</a>
							</GlossyCard>
						</CoolTextOnHover>
					</div>

					<div class="flex items-center justify-between">
						<span class="text-sm tracking-wide font-light">
							last synced {humanizeAbsolute(new Date(config.lastSyncedAt))}
						</span>
						{#if me && hasBeenOneDay(config.lastSyncedAt.toString())}
							<div class="flex items-center gap-1 text-sm font-semibold tracking-widest">
								<Button on:click={syncConfig} text="sync" icon={faRotate} loading={syncing} />
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="w-full gap-2 flex flex-col">
			<h3 class="text-lg font-semibold tracking-wide lowercase mt-2">
				<span>{plugins.length} plugins installed</span>
			</h3>
			{#if plugins.length > 0}
				<div class="sm:hidden">
					<PluginList {plugins} />
				</div>
				<div class="hidden sm:grid grid-cols-1 lg:grid-cols-3 gap-2">
					{#each plugins as plugin}
						<NeovimPluginCard
							owner={plugin.owner}
							name={plugin.name}
							stars={plugin.stars.toString()}
							configCount={plugin.configCount}
							category={plugin.category}
							shortDescription={plugin.shortDescription}
						/>
					{/each}
				</div>
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
