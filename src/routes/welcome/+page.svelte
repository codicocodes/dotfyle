<script lang="ts">
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faChevronRight, faFileCode, faRotate } from '@fortawesome/free-solid-svg-icons';
	import HeroTitle from '$lib/components/HeroTitle.svelte';
	import type { PageData } from './$types';
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import RepoPicker from '$lib/components/RepoPicker.svelte';
	import { trpc } from '$lib/trpc/client';
	import { page } from '$app/stores';
	import { fade, fly, slide } from 'svelte/transition';
	import InitFilePicker from '$lib/components/welcome-steps/InitFilePicker.svelte';
	import NeovimConfigMetaData from '$lib/components/NeovimConfigMetaData.svelte';
	import { unsyncedConfig } from '$lib/stores/unsyncedConfigStore';
	import type { InitFileNames } from '$lib/server/nvim-sync/services/init-file-finder';
	import type { NeovimPlugin } from '@prisma/client';
	import PluginList from '$lib/components/PluginList.svelte';
	import CoolText from '$lib/components/CoolText.svelte';
	import UnsyncedNeovimConfigCard from '$lib/components/UnsyncedNeovimConfigCard.svelte';

	export let data: PageData;

	let syncing = false;
	let completed = false;

	async function syncSelectedRepository() {
		if (
			!$unsyncedConfig.repo ||
			!$unsyncedConfig.initFile ||
			!$unsyncedConfig.root ||
			!$unsyncedConfig.branch
		) {
			return;
		}
		syncing = true;
		const syncedConfig = await trpc($page)
			.syncRepository.query({
				repo: $unsyncedConfig.repo,
				initFile: $unsyncedConfig.initFile as InitFileNames,
				root: $unsyncedConfig.root,
				branch: $unsyncedConfig.branch
			})
			.catch((e) => {
				console.log(e);
				throw e;
			});
		completed = true;
		syncing = false;
		unsyncedConfig.update((c) => ({
			...c,
			pluginManager: syncedConfig.pluginManager,
			plugins: syncedConfig.plugins as unknown as NeovimPlugin[]
		}));
	}
</script>

<!-- header -->
<div class="mx-auto xl:max-w-7xl">
	<div class="flex flex-col justify-center items-center">
		<HeroTitle>
			Welcome to <CoolText text="Dotfyle" />
		</HeroTitle>
		<div class="mx-auto xl:max-w-7xl w-full" />

		{#if syncing || completed}
			<div
				transition:fly={{ y: 100, duration: 1000 }}
				class="flex flex-col w-full max-w-xl gap-2 mx-12 my-2 px-8"
			>
      {#if completed}
				<div in:slide class="flex justify-end gap-4">
					<a
						class="flex items-center gap-1 text-green-500 hover:cursor-not-allowed hover:underline underline-offset-4 decoration-2"
					>
						<CoolText text="see profile" />
						<Fa icon={faChevronRight} size="xs" />
					</a>
				</div>
        {/if}

				<UnsyncedNeovimConfigCard avatar={data.user?.avatarUrl ?? ''} />
				<NeovimConfigMetaData {syncing} />
				<PluginList plugins={$unsyncedConfig.plugins ?? []} />
			</div>
		{/if}

		{#if !syncing && !completed}
			<div class="mx-auto xl:max-w-7xl sm:px-8 w-80 sm:w-full">
				<Stepper
					start={0}
					stepTerm=""
					gap="gap-4"
					badge="flex items-center gap-2 px-8 py-1 overflow-hidden rounded-md bg-white/40 border border-green-300/25"
					active="flex items-center gap-2 px-8 py-1 overflow-hidden rounded-md border border-green-300/25 bg-white/5 transition-colors truncate text-ellipsis transition-colors"
					on:complete={syncSelectedRepository}
					buttonBack="bg-white/50 px-4 py-2 rounded font-bold"
					buttonBackLabel="Back"
					buttonNext={`flex items-center bg-white/50 px-4 py-2 rounded font-bold`}
					buttonNextLabel="Next"
					buttonComplete="bg-emerald-500/90 px-4 py-2 rounded font-bold"
					buttonCompleteLabel="Run sync"
				>
					<Step locked={!$unsyncedConfig.repo}>
						<div slot="header">
							<h2
								class="mt-4 text-center font-light tracking-tight text-white sm:text-lg sm:tracking-tight lg:text-xl xl:text-2xl xl:tracking-tight flex items-center gap-2"
							>
								<Fa icon={faGithub} />select the github repository of your neovim config
							</h2>
						</div>

						<div in:fade>
							<RepoPicker repositoriesInput={data.repositories} />
						</div>
					</Step>
					<Step locked={!$unsyncedConfig.initFile}>
						<h2
							slot="header"
							class="mt-4 text-center font-light tracking-tight text-white sm:text-lg sm:tracking-tight lg:text-xl xl:text-2xl xl:tracking-tight flex items-center gap-2"
						>
							<Fa icon={faFileCode} size="sm" /> confirm the configs init file
						</h2>
						{#if $unsyncedConfig.repo}
							<div in:fade>
								<InitFilePicker />
							</div>
						{/if}
					</Step>
					<Step>
						<h2
							slot="header"
							class="mt-4 font-light tracking-tight text-white sm:text-lg sm:tracking-tight lg:text-xl xl:text-2xl xl:tracking-tight flex items-center gap-2"
						>
							<Fa icon={faRotate} size="sm" /> Sync your config with GitHub
						</h2>
						<div in:fade class="flex w-full items-center justify-center">
							<div class="flex flex-col w-full max-w-md gap-2 mx-0 md:mx-12 my-2">
								<UnsyncedNeovimConfigCard avatar={data.user?.avatarUrl ?? ''} />
								<NeovimConfigMetaData {syncing} />
							</div>
						</div>
					</Step>
				</Stepper>
			</div>
		{/if}
	</div>
</div>
