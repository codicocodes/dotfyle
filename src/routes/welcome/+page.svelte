<script lang="ts">
	import Fa from 'svelte-fa';
	import { faRotate } from '@fortawesome/free-solid-svg-icons';
	import HeroTitle from '$lib/components/HeroTitle.svelte';
	import type { GithubRepository } from '$lib/repositories/github/schema';
	import type { PageData } from './$types';
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import type { NeovimConfig } from '$lib/types';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import RepoPicker from '$lib/components/RepoPicker.svelte';
	import { trpc } from '$lib/trpc/client';
	import { page } from '$app/stores';
	import NeovimSyncLoader from '$lib/components/NeovimSyncLoader.svelte';
  import { fade, fly } from 'svelte/transition';


	export let data: PageData;

	let selectedConfig: GithubRepository | undefined;

	let syncing = false;

	$: selectedId = selectedConfig?.id;

	let language = 'unknown';
	let name = 'unknown';
	let stars = 0;

	async function syncSelectedRepository() {
		syncing = true;
		const syncedRepo = await trpc($page).syncRepository.query();
		syncing = false;
		console.log({ syncedRepo });
	}

	function onSelectConfig(repo: GithubRepository) {
		selectedConfig = repo;
	}

	$: {
		if (selectedConfig) {
			language = selectedConfig.language ?? 'unknown';
			name = selectedConfig.name;
			stars = selectedConfig.stargazers_count;
		}
	}

	$: fakeConfig = {
		stars,
		owner: data.user?.username as string,
		ownerAvatar: data.user?.avatarUrl as string,
		name,
		language,
		plugins: 0,
		pluginManager: 'unknown'
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

		{#if !syncing}
			<div class="flex justify-center items-center my-4 md:my-6">
				<div
					class="max-w-md px-4 sm:max-w-2xl sm:px-6 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-7xl"
				>
					<h2
						class="text-center font-light tracking-tight text-white sm:text-lg sm:tracking-tight lg:text-xl xl:text-2xl xl:tracking-tight"
					>
						select your neovim config to get started
					</h2>
				</div>
			</div>
		{/if}

		<div class="flex flex-col w-full max-w-xs md:w-96 gap-2 mx-12 my-2">
			<NeovimConfigCard config={fakeConfig} />
			{#if !syncing}
				<button
					class={`${
						selectedId
							? 'bg-white/30 hover:bg-white/50'
							: 'bg-white/10 text-gray-200 cursor-not-allowed'
					} font-semibold p-4 py-2 xl:px-6 xl:py-2 rounded flex gap-2 items-center`}
					on:click={syncSelectedRepository}
          disabled={!selectedConfig}
				>
					<Fa icon={faGithub} size="md" />
					<span class="flex w-full items-center justify-between text-sm gap-1">
						Sync with GitHub
						<Fa icon={faRotate} size="md" />
					</span>
				</button>
			{/if}
		</div>
		{#if !syncing}
    <div in:fade>
			<RepoPicker
				{selectedConfig}
				repositoriesInput={data.repositories}
				handleSelectConfig={onSelectConfig}
			/>
      </div>
		{/if}

		{#if syncing}
    <div in:fly="{{ y: 100, duration: 1500 }}">
      <NeovimSyncLoader />
      </div>
		{/if}
	</div>
</div>
