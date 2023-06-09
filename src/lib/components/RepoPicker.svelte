<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { slide } from 'svelte/transition';
	import RepoPickerItem from './RepoPickerItem.svelte';
	import Fa from 'svelte-fa';
	import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
	import GridContainer from './GridContainer.svelte';
	import type { GithubRepository } from '$lib/server/github/schema';
	import { unsyncedConfig } from '$lib/stores/unsyncedConfigStore';
	export let repositoriesInput: GithubRepository[];

	const likelyConfigs = repositoriesInput.filter((r: GithubRepository) => {
		return (
			r.name.includes('neovim') ||
			r.name.includes('nvim') ||
			r.name.includes('dotfile') ||
			r.name.includes('config')
		);
	});

	const likelyConfigIds = new Set(likelyConfigs.map((c) => c.id));

	const repositories = repositoriesInput.filter((r) => !likelyConfigIds.has(r.id));

	function selectConfigRepo({ owner: { login: owner }, name: repo, fork, default_branch: branch, stargazers_count: stars }: GithubRepository) {
		unsyncedConfig.update((c) => ({ ...c, owner, repo, fork, branch, stars }));
	}
</script>

<Accordion padding="">
	<div class="text-center">
		<div class="flex flex-col gap-2 my-4">
			<AccordionItem padding="py-1" open>
				<span
					slot="lead"
					class="flex w-full justify-end tracking-wider font-light sm:text-left text-lg"
					>likely configs
				</span>
				<Fa slot="summary" icon={faChevronDown} size="sm" />
				<div slot="content">
					<GridContainer>
						{#each likelyConfigs as repo, _}
							<button
								on:click={() => selectConfigRepo(repo)}
								on:keypress={() => selectConfigRepo(repo)}
								in:slide
							>
								<RepoPickerItem name={repo.name} selected={$unsyncedConfig.repo === repo.name} />
							</button>
						{/each}
					</GridContainer>
				</div>
			</AccordionItem>
		</div>
		<div class="flex flex-col gap-2 my-4">
			<AccordionItem padding="py-1">
				<span
					slot="lead"
					class="flex w-full justify-end text-lg tracking-wider font-light sm:text-left"
					>all repositories
				</span>
				<Fa slot="summary" icon={faChevronDown} size="sm" />
				<div slot="content">
					<GridContainer>
						{#each repositories as repo, _}
							<button
								on:click={() => selectConfigRepo(repo)}
								on:keypress={() => selectConfigRepo(repo)}
								in:slide
							>
								<RepoPickerItem name={repo.name} selected={$unsyncedConfig.repo === repo.name} />
							</button>
						{/each}
					</GridContainer>
				</div>
			</AccordionItem>
		</div>
	</div>
</Accordion>
