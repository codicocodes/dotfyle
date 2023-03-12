<script lang="ts">
	import type { GithubRepository } from "$lib/repositories/github/schema";
	import RepoPickerItem from "./RepoPickerItem.svelte";
  export let selectedConfig: GithubRepository | undefined
  export let repositoriesInput: GithubRepository[]
  export let handleSelectConfig: (r: GithubRepository) => void

	$: selectedId = selectedConfig?.id;

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

</script>
<div class="text-center">
	<div class="flex flex-col gap-2 my-4">
		<span class="font-xxs tracking-wider font-light sm:text-left">likely configs</span>
		<div
			class="sm:grid sm:grid-flow-row auto-rows-max sm:grid-cols-2 space-y-2 sm:space-y-0 md:grid-cols-3 gap-2"
		>
			{#each likelyConfigs as repo, _}
				<button
					on:click={() => handleSelectConfig(repo)}
					on:keypress={() => handleSelectConfig(repo)}
				>
					<RepoPickerItem name={repo.name} selected={selectedId === repo.id} />
				</button>
			{/each}
		</div>
	</div>
	<div class="flex flex-col gap-2 my-4">
		<span class="font-xxs tracking-wider font-light sm:text-left">all repos</span>
		<div
			class="sm:grid sm:grid-flow-row auto-rows-max sm:grid-cols-2 space-y-2 sm:space-y-0 md:grid-cols-3 gap-2"
		>
			{#each repositories as repo, _}
				<button
					on:click={() => handleSelectConfig(repo)}
					on:keypress={() => handleSelectConfig(repo)}
				>
					<RepoPickerItem name={repo.name} selected={selectedId === repo.id} />
				</button>
			{/each}
		</div>
	</div>
</div>
