<script lang="ts">
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faFileCode, faPersonDigging, faRotate } from '@fortawesome/free-solid-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import RepoPicker from '$lib/components/RepoPicker.svelte';
	import { trpc } from '$lib/trpc/client';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import InitFilePicker from '$lib/components/welcome-steps/InitFilePicker.svelte';
	import { unsyncedConfig } from '$lib/stores/unsyncedConfigStore';
	import type { User } from '@prisma/client';
	import UnsyncedNeovimConfigCard from '$lib/components/UnsyncedNeovimConfigCard.svelte';
	import UnsyncedNeovimConfigMetaData from '$lib/components/UnsyncedNeovimConfigMetaData.svelte';
	import type { GithubRepository } from '$lib/server/github/schema';
	import type { InitFileNames } from '$lib/server/nvim-sync/config/InitFileFinder';
	import { goto } from '$app/navigation';
	import { DoubleBounce } from 'svelte-loading-spinners';
	import { isMaintenanceMode } from '$lib/utils';

	export let repositories: GithubRepository[];
	export let user: User;

	let syncing = false;
	let completed = false;

	async function syncSelectedRepository() {
		if (
			!$unsyncedConfig.repo ||
			!$unsyncedConfig.initFile ||
			$unsyncedConfig.root === undefined ||
			!$unsyncedConfig.branch
		) {
			return;
		}
		syncing = true;
		const syncedConfig = await trpc($page)
			.createNeovimConfig.query({
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
		goto(`/${syncedConfig.owner}/${syncedConfig.slug}`);
	}
</script>

{#if isMaintenanceMode()}
	<h2
		class="my-4 text-center font-light tracking-tight text-white sm:text-lg sm:tracking-tight lg:text-xl xl:text-2xl xl:tracking-tight flex items-center gap-2"
	>
		<Fa icon={faPersonDigging} />Dotfyle is under maintenance. You can sync your config shortly.
	</h2>
{:else}
	{#if syncing || completed}
		<div class="flex w-full justify-center">
			<DoubleBounce color="#15be97" size="42" />
		</div>
	{/if}

	{#if !syncing && !completed}
		<div class="mx-auto max-w-5xl sm:px-8 w-80 sm:w-full">
			<Stepper
				start={0}
				stepTerm=""
				gap="gap-4"
				badge="flex items-center gap-2 px-8 py-1 overflow-hidden rounded-md bg-white/40 border border-primary-300/25"
				active="flex items-center gap-2 px-8 py-1 overflow-hidden rounded-md border border-primary-300/25 bg-white/5 transition-colors truncate text-ellipsis transition-colors"
				on:complete={syncSelectedRepository}
				buttonBack="bg-white/50 px-4 py-2 rounded font-bold shadow-xl hover:shadow-primary-300/25"
				buttonBackLabel="Back"
				buttonNext={`flex items-center bg-white/50 px-4 py-2 rounded font-bold shadow-xl hover:shadow-primary-300/25`}
				buttonNextLabel="Next"
				buttonComplete="bg-primary-500/90 px-4 py-2 rounded font-bold shadow-xl shadow-primary-300/25 hover:bg-gradient-primary"
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
						<RepoPicker repositoriesInput={repositories} />
					</div>
				</Step>
				<Step locked={!$unsyncedConfig.initFile}>
					<h2
						slot="header"
						class="mt-4 text-center font-light tracking-tight text-white sm:text-lg sm:tracking-tight lg:text-xl xl:text-2xl xl:tracking-tight flex items-center gap-2"
					>
						<Fa icon={faFileCode} size="sm" /> confirm the configs root init file
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
						<div class="flex flex-col w-full max-w-5xl gap-2 mx-0 md:mx-12 my-2">
							<UnsyncedNeovimConfigCard avatar={user.avatarUrl} />
							<UnsyncedNeovimConfigMetaData {syncing} />
						</div>
					</div>
				</Step>
			</Stepper>
		</div>
	{/if}
{/if}
