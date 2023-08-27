<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { GithubRepository } from '$lib/server/github/schema';
	import { trpc } from '$lib/trpc/client';
	import { NeovimPluginRepositorySchema } from '$lib/validation';
	import { faFloppyDisk, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Button from './Button.svelte';
	import MediumHeroTitle from './MediumHeroTitle.svelte';
	import Modal from './Modal.svelte';
	import NeovimPluginMetaData from './NeovimPluginMetaData.svelte';
	import RepositoryCard from './RepositoryCard.svelte';
	import SingleSelectFilter from './SingleSelectFilter.svelte';
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
	let validationErrors: string[] = [];

	function reset() {
		openModal = false;
		fetchedRepository = undefined;
		fullName = '';
		selectedCategory = null;
	}

	function fetchRepository() {
		if (owner && name) {
			trpc($page)
				.getGitHubRepository.query({ owner, name })
				.then((repository) => {
					fetchedRepository = repository;
					const parsed = NeovimPluginRepositorySchema.safeParse(repository);
					if (!parsed.success) {
						validationErrors = parsed.error.errors.map((e) => e.message);
					}
				});
		}
	}

	function savePlugin() {
		if (owner && name && selectedCategory) {
			trpc($page)
				.createNeovimPlugin.query({ owner, name, category: selectedCategory })
				.then((plugin) => {
					reset();
					goto(`/plugins/${plugin.owner}/${plugin.name}`);
				});
		}
	}
</script>

<button
	on:click={() => (openModal = true)}
	class="border-[0.5px] border-gray-400 bg-white/20 p-2 rounded"
	title="add plugin"
>
	<Fa icon={faPlus} size="xs" />
</button>

{#if openModal}
	<Modal
		showModal={openModal}
		onClose={() => {
			openModal = false;
			reset();
		}}
	>
		<div slot="header">
			<MediumHeroTitle>Add a Neovim Plugin to Dotfyle</MediumHeroTitle>
		</div>
		<div class="mt-8 w-full grow">
			{#if !fetchedRepository}
				<div class="px-4 flex flex-col gap-2 my-4">
					<div class="flex text-xs font-semibold gap-2 flex-wrap">Validation</div>
					<div class="flex gap-2">
						<span class="bg-white/10 px-2 py-1 rounded {owner ? 'text-green-400' : 'text-red-400'}">
							owner
						</span>
						<span class="bg-white/10 px-2 py-1 rounded {name ? 'text-green-400' : 'text-red-400'}">
							repository
						</span>
						<Button
							on:click={fetchRepository}
							disabled={!owner || !name}
							icon={faSearch}
							text="Find Repository"
						/>
					</div>
					<div class="flex text-xs font-semibold gap-2 flex-wrap">Plugin Name</div>
					<input
						bind:value={fullName}
						class="text-black font-medium rounded p-2 w-full"
						placeholder="owner/repository"
					/>
				</div>
			{/if}
			{#if fetchedRepository}
				<div class="px-4 flex flex-col gap-2 my-4">
					<RepositoryCard
						name="{owner}/{name}"
						link="/"
						description={fetchedRepository.description ?? ''}
					>
						<NeovimPluginMetaData
							slot="footer"
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
							</li>
						{/each}
					</ul>
				</div>
				<SingleSelectFilter
					on:updated={({ detail }) => {
						selectedCategory = detail.selected;
					}}
					title="Plugin Category"
					expandAtCount={100}
					items={pluginCategories}
					selected={selectedCategory}
				/>
				<Button text="Save Plugin" icon={faFloppyDisk} on:click={savePlugin} />
			{/if}
		</div>
	</Modal>
{/if}
