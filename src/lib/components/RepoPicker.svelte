<script lang="ts">
  import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
  import { slide } from 'svelte/transition';
  import RepoPickerItem from './RepoPickerItem.svelte';
  import Fa from 'svelte-fa';
  import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
  import GridContainer from './GridContainer.svelte';
  import type { GithubRepository } from '$lib/server/github/schema';
  import { unsyncedConfig } from '$lib/stores/unsyncedConfigStore';
  interface Props {
    repositoriesInput: GithubRepository[];
  }

  let { repositoriesInput }: Props = $props();

  let likelyConfigs = $derived(
    repositoriesInput.filter((r: GithubRepository) => {
      return (
        r.name.includes('neovim') ||
        r.name.includes('nvim') ||
        r.name.includes('dotfile') ||
        r.name.includes('config')
      );
    })
  );

  let likelyConfigIds = $derived(new Set(likelyConfigs.map((c) => c.id)));

  let repositories = $derived(repositoriesInput.filter((r) => !likelyConfigIds.has(r.id)));

  function selectConfigRepo({
    owner: { login: owner },
    name: repo,
    fork,
    default_branch: branch,
    stargazers_count: stars
  }: GithubRepository) {
    unsyncedConfig.update((c) => ({ ...c, owner, repo, fork, branch, stars }));
  }
</script>

<Accordion padding="">
  <div class="text-center">
    <div class="flex flex-col gap-2 my-4">
      <AccordionItem padding="py-1" open>
        {#snippet lead()}
          <span class="flex w-full justify-end tracking-wider font-light sm:text-left text-lg"
            >likely configs
          </span>
        {/snippet}
        {#snippet summary()}
          <Fa icon={faChevronDown} size="sm" />
        {/snippet}
        {#snippet content()}
          <div>
            <GridContainer>
              {#each likelyConfigs as repo}
                <button
                  onclick={() => selectConfigRepo(repo)}
                  onkeypress={() => selectConfigRepo(repo)}
                  in:slide|global
                >
                  <RepoPickerItem name={repo.name} selected={$unsyncedConfig.repo === repo.name} />
                </button>
              {/each}
            </GridContainer>
          </div>
        {/snippet}
      </AccordionItem>
    </div>
    <div class="flex flex-col gap-2 my-4">
      <AccordionItem padding="py-1">
        {#snippet lead()}
          <span class="flex w-full justify-end text-lg tracking-wider font-light sm:text-left"
            >all repositories
          </span>
        {/snippet}
        {#snippet summary()}
          <Fa icon={faChevronDown} size="sm" />
        {/snippet}
        {#snippet content()}
          <div>
            <GridContainer>
              {#each repositories as repo}
                <button
                  onclick={() => selectConfigRepo(repo)}
                  onkeypress={() => selectConfigRepo(repo)}
                  in:slide|global
                >
                  <RepoPickerItem name={repo.name} selected={$unsyncedConfig.repo === repo.name} />
                </button>
              {/each}
            </GridContainer>
          </div>
        {/snippet}
      </AccordionItem>
    </div>
  </div>
</Accordion>
