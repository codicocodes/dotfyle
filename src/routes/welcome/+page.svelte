<script lang="ts">
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faFileCode, faRotate } from '@fortawesome/free-solid-svg-icons';
	import HeroTitle from '$lib/components/HeroTitle.svelte';
	import type { PageData } from './$types';
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import type { NeovimConfig } from '$lib/types';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import RepoPicker from '$lib/components/RepoPicker.svelte';
	import { trpc } from '$lib/trpc/client';
	import { page } from '$app/stores';
	import { fade, fly } from 'svelte/transition';
	import InitFilePicker from '$lib/components/welcome-steps/InitFilePicker.svelte';
	import type { InitFile } from '$lib/nvim-sync/services/init-file-finder';
	import NeovimConfigMetaData from '$lib/components/NeovimConfigMetaData.svelte';
	import type { GithubRepository } from '$lib/github/schema';

	export let data: PageData;

	let repoName: string | undefined;

	let initFile: InitFile | undefined;

	let syncing = false;
	let completed = false;

	const reposByName: Record<string, GithubRepository> = Object.fromEntries(
		data.repositories.map((r) => [r.name, r])
	);

	$: selectedRepo = repoName ? reposByName[repoName] : undefined;

	let language = 'unknown';
	let path = 'unknown';
	let root: string | undefined;
	let name = 'unknown';
	let stars = 0;

	async function syncSelectedRepository() {
		if (!selectedRepo || !initFile || !repoName) {
			return;
		}
		syncing = true;
		const syncedRepo = await trpc($page)
			.syncRepository.query({
				repo: repoName,
				initFile: initFile.type,
				root: initFile.root,
				branch: selectedRepo.default_branch
			})
			.catch((e) => {
				console.log(e);
				throw e;
			});
		completed = true;
		syncing = false;
		console.log(syncedRepo);
	}

	function onSelectInitFile(f: InitFile) {
		initFile = f;
	}

	function onSelectRepo(repo: string) {
		repoName = repo;
	}

	$: {
		if (selectedRepo) {
			if (name !== selectedRepo.name) {
				initFile = undefined;
				path = 'unknown';
				root = undefined;
			}
			language = selectedRepo.language ?? 'unknown';
			name = selectedRepo.name;
			stars = selectedRepo.stargazers_count;
		}
		if (initFile) {
			path = initFile.path;
			root = initFile.root;
		}
	}

	$: fakeConfig = {
		stars,
		owner: data.user?.username as string,
		ownerAvatar: data.user?.avatarUrl as string,
		name,
		language,
		plugins: 0,
		pluginManager: 'unknown',
		path,
		root
	} as NeovimConfig;
</script>

<!-- header -->
<div class="mx-auto xl:max-w-7xl">
	<div class="flex flex-col justify-center items-center">
		<HeroTitle>
			Welcome to <span
				class="text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-green-500"
				>Dotfyle</span
			>
		</HeroTitle>
		<div class="mx-auto xl:max-w-7xl w-full" />

		{#if syncing || completed}
			<div
				transition:fly={{ y: 100, duration: 1000 }}
				class="flex flex-col w-full max-w-md gap-2 mx-12 my-2 px-8"
			>
				<NeovimConfigCard config={fakeConfig} />
				<NeovimConfigMetaData {initFile} {syncing} />
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
					<Step locked={!selectedRepo}>
						<div slot="header">
							<h2
								class="mt-4 text-center font-light tracking-tight text-white sm:text-lg sm:tracking-tight lg:text-xl xl:text-2xl xl:tracking-tight flex items-center gap-2"
							>
								<Fa icon={faGithub} />select the github repository of your neovim config
							</h2>
						</div>

						<div in:fade>
							<RepoPicker
								selectedRepo={repoName}
								repositoriesInput={data.repositories}
								handleSelectConfig={onSelectRepo}
							/>
						</div>
					</Step>
					<Step locked={!initFile}>
						<h2
							slot="header"
							class="mt-4 text-center font-light tracking-tight text-white sm:text-lg sm:tracking-tight lg:text-xl xl:text-2xl xl:tracking-tight flex items-center gap-2"
						>
							<Fa icon={faFileCode} size="sm" /> confirm the configs init file
						</h2>
						{#if selectedRepo}
							<div in:fade>
								<InitFilePicker
									{selectedRepo}
									selectedFile={initFile}
									handleSelectInitFile={onSelectInitFile}
								/>
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
								<NeovimConfigCard config={fakeConfig} />
								<NeovimConfigMetaData {initFile} {syncing} />
							</div>
						</div>
					</Step>
				</Stepper>
			</div>
		{/if}
	</div>
</div>
