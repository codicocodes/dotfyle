<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { GithubRepository } from '$lib/server/github/schema';
	import { trpc } from '$lib/trpc/client';
	import { NeovimPluginRepositorySchema } from '$lib/validation';
	import { faFloppyDisk, faSearch } from '@fortawesome/free-solid-svg-icons';
	import MediumHeroTitle from '$lib/components/MediumHeroTitle.svelte';
	import Button from '$lib/components/Button.svelte';
	import RepositoryCard from '$lib/components/RepositoryCard.svelte';
	import NeovimPluginMetaData from '$lib/components/NeovimPluginMetaData.svelte';
	import SingleSelectFilter from '$lib/components/SingleSelectFilter.svelte';
	import { isAdmin } from '$lib/utils';
	import { session } from '$lib/stores/session';
	import type { PageData } from './types';

	export let data: PageData;
	let pluginCategories: string[] = [];
	let selectedCategory: string | null = null;
	let openModal = false;
	$: {
		trpc($page)
			.listPluginCategories.query()
			.then((categories) => {
				pluginCategories = categories;
			});
	}
	let fullName = '';

	$: [owner, name] = fullName.split('/');
	let fetchedRepository: GithubRepository | undefined;
	let pluginAlreadyExists = false;
	let repositoryDoesNotExist = false;
	let validationErrors: string[] = [];

	function reset() {
		openModal = false;
		fetchedRepository = undefined;
		fullName = '';
		selectedCategory = null;
	}

	async function fetchRepository() {
		if (owner && name) {
			validationErrors = [];
			const plugin = await trpc($page)
				.getPlugin.query({ owner, name })
				.catch(() => {
					return null;
				});

			if (plugin) {
				pluginAlreadyExists = true;
				return;
			}
			fetchedRepository = await trpc($page)
				.getGitHubRepository.query({ owner, name })
				.catch(() => {
					return undefined;
				});

			if (!fetchedRepository) {
				repositoryDoesNotExist = true;
				return;
			}
			const parsed = NeovimPluginRepositorySchema.safeParse(fetchedRepository);
			if (!parsed.success) {
				validationErrors = parsed.error.errors.map((e) => e.message);
			}
		}
	}

	function savePlugin() {
		if (owner && name && selectedCategory) {
			trpc($page)
				.createNeovimPlugin.mutate({ owner, name, category: selectedCategory })
				.then((plugin) => {
					reset();
					goto(`/plugins/${plugin.owner}/${plugin.name}`);
				});
		}
	}
</script>

<MediumHeroTitle>Add a Neovim Plugin to Dotfyle</MediumHeroTitle>
<div class="mt-8 w-full grow">
	<div class="flex gap-2 p-4">
		<button
			class="p-2 rounded {fetchedRepository
				? 'bg-black/30'
				: 'bg-white text-black'} rounded-xl border-[1px] border-accent-muted hover:border-accent-bright"
			on:click={() => {
				fetchedRepository = undefined;
				fullName = '';
				repositoryDoesNotExist = false;
				pluginAlreadyExists = false;
			}}
		>
			1. Select repository
		</button>
		<div
			class="p-2 rounded {!fetchedRepository
				? 'bg-black/30 text-white'
				: 'bg-white text-black'} rounded-xl border-[1px] border-accent-muted hover:border-accent-bright"
		>
			2. Select category
		</div>
	</div>
	{#if !fetchedRepository}
		<form class="px-4 flex flex-col gap-2 my-4">
			<h3 class="flex text-xl font-semibold gap-2 flex-wrap">
				Search for a plugin to add on Dotfyle
			</h3>
			<div class="flex gap-2" />
			<div class="w-full flex gap-2">
				<input
					on:change={() => {
						pluginAlreadyExists = false;
						repositoryDoesNotExist = false;
					}}
					bind:value={fullName}
					class="bg-black/30 text-gray font-medium rounded-xl p-2 px-4 w-full focus:outline-none border-[1px] border-accent-muted"
					placeholder="owner/repository"
				/>
				<Button
					type="submit"
					on:click={fetchRepository}
					disabled={!owner || !name || repositoryDoesNotExist || pluginAlreadyExists}
					icon={faSearch}
					text="Search"
					event="Add Plugin - Search"
				/>
			</div>
			<ul class="text-red-400 flex flex-col">
				{#if !owner}
					<li>Repository owner is required</li>
				{/if}

				{#if !name}
					<li>Repository name is required</li>
				{/if}

				{#if pluginAlreadyExists}
					<li>This plugin is already on Dotfyle and cannot be added</li>
				{/if}

				{#if repositoryDoesNotExist}
					<li>This repository does not exist on GitHub and cannot be added</li>
				{/if}
			</ul>
		</form>
	{/if}
	{#if fetchedRepository}
		<div class="px-4 flex flex-col gap-2 my-4">
			<RepositoryCard
				name="{owner}/{name}"
				link=""
				description={fetchedRepository.description ?? ''}
			>
				<NeovimPluginMetaData
					stars={fetchedRepository.stargazers_count.toString()}
					configCount={0}
					category={selectedCategory ?? 'UNKNOWN CATEGORY'}
					addedLastWeek={0}
				/>
			</RepositoryCard>

			<ul class="text-red-400">
				{#each validationErrors as err}
					<li>
						{err}
						{#if err.includes('neovim-plugin')}
							<a
								target="_blank"
								href={`https://github.com/${fetchedRepository.owner.login}/${fetchedRepository.name}/issues/new?title=Add 'neovim-plugin' as topic to the GitHub repository`}
								class="text-white hover:text-accent-muted hover:cursor-pointer"
								>make issue on GitHub</a
							>
						{/if}
					</li>
				{/each}
				{#if !selectedCategory}
					<li>Selecting a category is required</li>
				{/if}
			</ul>
		</div>
		<SingleSelectFilter
			on:updated={({ detail }) => {
				selectedCategory = detail.selected;
			}}
			title="Select a plugin category"
			expandAtCount={100}
			items={pluginCategories}
			selected={selectedCategory}
		/>
		<Button
			disabled={isAdmin($session.user)
				? !selectedCategory
				: !selectedCategory || validationErrors.length !== 0}
			text="Save Plugin"
			icon={faFloppyDisk}
			on:click={savePlugin}
			event="Add Plugin - Create"
		/>
	{/if}
</div>
