<script lang="ts">
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import {
		faFileCode,
		faPuzzlePiece,
		faRotate,
		faUser,
	} from '@fortawesome/free-solid-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import RepoPicker from '$lib/components/RepoPicker.svelte';
	import { trpc } from '$lib/trpc/client';
	import { page } from '$app/stores';
	import { fade, fly, slide } from 'svelte/transition';
	import InitFilePicker from '$lib/components/welcome-steps/InitFilePicker.svelte';
	import { unsyncedConfig } from '$lib/stores/unsyncedConfigStore';
	import type { InitFileNames } from '$lib/server/nvim-sync/services/init-file-finder';
	import type { NeovimPlugin, User } from '@prisma/client';
	import PluginList from '$lib/components/PluginList.svelte';
	import UnsyncedNeovimConfigCard from '$lib/components/UnsyncedNeovimConfigCard.svelte';
	import UnsyncedNeovimConfigMetaData from '$lib/components/UnsyncedNeovimConfigMetaData.svelte';
	import type { GithubRepository } from '$lib/server/github/schema';
	import ShareConfig from '../ShareConfig.svelte';
	import CoolTextWithChildren from '../CoolTextWithChildren.svelte';

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
		unsyncedConfig.update((c) => ({
			...c,
			pluginManager: syncedConfig.pluginManager,
			slug: syncedConfig.slug,
			plugins: syncedConfig.plugins as unknown as NeovimPlugin[]
		}));
	}
</script>

{#if syncing || completed}
	<div
		transition:fly={{ y: 100, duration: 1000 }}
		class="flex flex-col w-full max-w-5xl gap-2 mx-12 my-2 px-8"
	>
		{#if completed}
			<div in:slide class="flex justify-end gap-4">
				<ShareConfig owner={$unsyncedConfig.owner ?? ''} slug={$unsyncedConfig.slug ?? ''} />
				<a href={`/${$unsyncedConfig.owner}`} class=" bg-gray-700 p-2 rounded">
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
		{/if}

		<UnsyncedNeovimConfigCard avatar={user.avatarUrl} />
		<UnsyncedNeovimConfigMetaData {syncing} />

		{#if $unsyncedConfig.plugins !== undefined && $unsyncedConfig.plugins.length > 0}
			<div class="flex items-center justify-between">
				<h3 class="flex items-center gap-1 text-sm tracking-wide font-semibold pl-1">
					<Fa icon={faPuzzlePiece} />
					plugins
				</h3>
			</div>
			<PluginList plugins={$unsyncedConfig.plugins.map((p) => ({ ...p, configCount: -1 }))} />
		{/if}
	</div>
{/if}

{#if !syncing && !completed}
	<div class="mx-auto max-w-5xl sm:px-8 w-80 sm:w-full">
		<Stepper
			start={0}
			stepTerm=""
			gap="gap-4"
			badge="flex items-center gap-2 px-8 py-1 overflow-hidden rounded-md bg-white/40 border border-green-300/25"
			active="flex items-center gap-2 px-8 py-1 overflow-hidden rounded-md border border-green-300/25 bg-white/5 transition-colors truncate text-ellipsis transition-colors"
			on:complete={syncSelectedRepository}
			buttonBack="bg-white/50 px-4 py-2 rounded font-bold shadow-xl hover:shadow-green-300/25"
			buttonBackLabel="Back"
			buttonNext={`flex items-center bg-white/50 px-4 py-2 rounded font-bold shadow-xl hover:shadow-green-300/25`}
			buttonNextLabel="Next"
			buttonComplete="bg-emerald-500/90 px-4 py-2 rounded font-bold shadow-xl shadow-green-300/25 hover:bg-gradient-to-br hover:from-cyan-500 hover:to-green-500"
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
