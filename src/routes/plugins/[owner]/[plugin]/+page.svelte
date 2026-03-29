<script lang="ts">
  import { stopPropagation } from 'svelte/legacy';

  import Button from '$lib/components/Button.svelte';
  import CoolLink from '$lib/components/CoolLink.svelte';
  import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
  import { trpc } from '$lib/trpc/client';
  import { copyToClipboard, getMediaType, humanizeRelative, isAdmin } from '$lib/utils';
  import { faGithub } from '@fortawesome/free-brands-svg-icons';
  import {
    faArrowTrendUp,
    faBomb,
    faCameraRetro,
    faCopy,
    faDeleteLeft,
    faEdit,
    faInfoCircle,
    faStar,
    faSync,
    faToggleOff,
    faToggleOn,
    faUsers
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import PostContainer from '$lib/components/PostContainer.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import type { Media } from '@prisma/client';
  import OpenGraph from '$lib/components/OpenGraph.svelte';
  import RepositoryCard from '$lib/components/RepositoryCard.svelte';
  import BigGridContainer from '$lib/components/BigGridContainer.svelte';
  import NeovimPluginMetaData from '$lib/components/NeovimPluginMetaData.svelte';
  import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
  import { lua, markdown } from 'svelte-highlight/languages';
  import { Highlight } from 'svelte-highlight';
  import Accordion from '$lib/components/accordion.svelte';
  import { session } from '$lib/stores/session';
  import ActionButton from '$lib/components/ActionButton.svelte';
  import { githubDark } from 'svelte-highlight/styles';
  import TextGeneration from '$lib/components/TextGeneration.svelte';
  interface Props {
    data: PageData;
  }

  let { data = $bindable() }: Props = $props();

  let categoryPlugins = $derived(
    data.categoryPlugins.filter((p) => p.name != data.plugin.name).slice(0, 4)
  );

  let style = $state('flat');

  let badgesHtml = $derived(
    `<a href="https://dotfyle.com/plugins/${data.plugin.owner}/${data.plugin.name}">\n\t<img src="https://dotfyle.com/plugins/${data.plugin.owner}/${data.plugin.name}/shield?style=${style}" />\n</a>`
  );

  let firstImage = $derived(data.media.filter((m) => getMediaType(m) === 'image')?.[0]?.url);

  let selectedMedia: Media | undefined = $state();

  async function deleteMedia(id: number) {
    await trpc($page).deleteMedia.mutate({
      id
    });
  }
  async function toggleThumbnail(id: number) {
    await trpc($page).toggleThumbnail.mutate({
      id
    });
    if (selectedMedia && selectedMedia.id === id) {
      selectedMedia.thumbnail = !selectedMedia.thumbnail;
    }
  }

  let editingDescription = $state(false);

  let editingInstallInstructions = $state(false);

  let description = $state(data.plugin.description);

  async function saveDescription() {
    await trpc($page).savePluginDescription.mutate({
      id: data.plugin.id,
      description
    });
    data.plugin.description = description;
  }

  async function generateInstallInstructions() {
    let generated = await trpc($page).generateInstallInstructions.mutate({
      id: data.plugin.id,
      pluginManager
    });
    instructions = generated || 'failed generating';
  }
  async function saveInstallInstructions() {
    await trpc($page).saveInstallInstructions.mutate({
      id: data.plugin.id,
      instructions,
      pluginManager
    });
  }

  async function generateDescription() {
    let generated = await trpc($page).generatePluginDescription.mutate({
      id: data.plugin.id
    });
    description = generated || 'failed generating';
  }

  let pluginManager = $state('lazy.nvim');
  let instructions = $state(data.installInstructions?.['lazy.nvim']?.instructions ?? '');
</script>

<Modal
  showModal={editingDescription}
  onClose={() => {
    editingDescription = false;
  }}
>
  <div class="my-4 w-[800px] h-[400px]">
    <TextGeneration bind:text={description} save={saveDescription} generate={generateDescription} />
  </div>
</Modal>

<Modal
  showModal={editingInstallInstructions}
  onClose={() => {
    editingInstallInstructions = false;
  }}
>
  <div class="my-4 w-[800px] h-[400px]">
    <div class="flex gap-1 my-2">
      {#each ['lazy.nvim', 'packer.nvim'] as currPM}
        <button
          onclick={() => (pluginManager = currPM)}
          class={`flex items-center text-sm sm:text-xs text-black px-4 py-1 rounded ${
            pluginManager === currPM ? 'bg-accent-muted' : 'bg-white'
          }`}
        >
          {currPM}
        </button>
      {/each}
    </div>
    <TextGeneration
      bind:text={instructions}
      save={saveInstallInstructions}
      generate={generateInstallInstructions}
    />
  </div>
</Modal>

<svelte:head>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html githubDark}
  <title>
    {data.plugin.owner}/{data.plugin.name} - Neovim plugin | Developers using {data.plugin.name} | Alternatives
    to {data.plugin.name}
  </title>
  <OpenGraph
    title="{data.plugin.owner}/{data.plugin.name} - Neovim plugin | Developers using {data.plugin
      .name} | Alternatives to {data.plugin.name}"
    url="https://dotfyle.com/plugins/{data.plugin.owner}/{data.plugin.name}"
    description={data.plugin.description || data.plugin.shortDescription}
    image={firstImage}
  />
</svelte:head>

{#if selectedMedia}
  <Modal showModal={!!selectedMedia} onClose={() => (selectedMedia = undefined)}>
    {#if $session.user && isAdmin($session.user)}
      <div class="flex gap-2 my-2">
        <Button onclick={() => deleteMedia(selectedMedia!.id)} icon={faDeleteLeft} text="Delete" />
        <Button
          onclick={() => toggleThumbnail(selectedMedia!.id)}
          icon={selectedMedia!.thumbnail ? faToggleOff : faToggleOn}
          text={selectedMedia!.thumbnail ? 'Remove as thumbnail' : 'Make into thumbnail'}
        />
      </div>
    {/if}
    {#if getMediaType(selectedMedia) === 'video'}
      <video class="rounded:cursor-pointer" src={selectedMedia.url} autoplay muted playsinline
      ></video>
    {:else}
      <img class="rounded:cursor-pointer" alt="" src={selectedMedia.url} />
    {/if}
  </Modal>
{/if}
<div class="w-full flex flex-col items-center h-full my-14 px-4">
  <div class="flex flex-col max-w-5xl w-full gap-4">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center flex-wrap">
        <div class="text-lg sm:text-xl flex gap-2 items-center flex-wrap">
          {#if data.owner}
            <img
              alt=""
              class="inline h-8 w-8 rounded-full items-center"
              height="8"
              width="8"
              src={data.owner.avatarUrl}
            />
            <a href="/{data.owner.username}" class="inline whitespace-nowrap">
              <CoolTextOnHover>
                {data.plugin.owner}
              </CoolTextOnHover>
            </a>
          {:else}
            <span class="whitespace-nowrap">{data.plugin.owner}</span>
          {/if}
          /
          <span class="whitespace-nowrap">
            {data.plugin.name}
          </span>
        </div>

        {#if $session.user && isAdmin($session.user)}
          <ActionButton>
            {#snippet actions()}
              <div class="flex w-52 flex-col">
                <button
                  onclick={() => (editingDescription = true)}
                  class="px-4 py-2 flex w-full gap-2 items-center justify-between"
                >
                  <Fa icon={faEdit} /> Description
                </button>
                <button
                  onclick={() => (editingInstallInstructions = true)}
                  class="px-4 py-2 flex w-full gap-2 items-center justify-between"
                >
                  <Fa icon={faEdit} /> Install instructions
                </button>
              </div>
            {/snippet}
          </ActionButton>
        {/if}
      </div>

      <h1 class="text-3xl sm:text-5xl flex gap-2 items-center font-semibold">
        {data.plugin.name}
      </h1>

      <span class="flex items-center text-lg sm:text-xl tracking-wide gap-2 mt-2">
        {data.plugin.shortDescription}
      </span>
      <hr class="my-4" />
      <div
        class="flex text-base sm:text-base font-semibold tracking-wide justify-between flex-wrap"
      >
        <div class="flex gap-4">
          <span title="GitHub stars" class="py-1 flex gap-1 items-center font-semibold">
            <Fa icon={faStar} />
            {data.plugin.stars}
          </span>
          <span
            title="Total installs on Dotfyle"
            class="py-1 flex gap-1 items-center font-semibold"
          >
            <Fa icon={faUsers} />
            {data.plugin.configCount}
          </span>
          <span title="Installs last week" class="py-1 flex gap-1 items-center font-semibold">
            <Fa icon={faArrowTrendUp} />
            {data.plugin.addedLastWeek}
          </span>

          {#if data.plugin.lastSyncedAt}
            <span class="flex items-center gap-1" title="Time since last synced on Dotfyle">
              <Fa size="xs" icon={faSync} />
              {humanizeRelative(
                new Date().getTime() - new Date(data.plugin.lastSyncedAt).getTime()
              )}
            </span>
          {/if}
        </div>

        <a href="https://github.com/{data.plugin.owner}/{data.plugin.name}" target="_blank">
          <Button text="GitHub" icon={faGithub} />
        </a>
      </div>

      <div class="flex flex-row w-full items-center gap-4 whitespace-nowrap flex-wrap">
        <span
          class="items-center text-sm sm:text-xs font-medium tracking-wide gap-2 bg-white text-black px-2 py-1 rounded"
        >
          {data.plugin.category}
        </span>
        <span
          class="items-center text-sm sm:text-xs font-medium tracking-wide gap-2 bg-white text-black px-2 py-1 rounded"
        >
          {data.plugin.source}
        </span>
      </div>

      <div class="flex flex-col my-4 gap-4">
        <span class="sm:text-lg tracking-wide">
          {data.plugin.description}
        </span>
      </div>
    </div>
    <div class="flex flex-col w-full items-center justify-between gap-8">
      {#if data.breaking.length > 0}
        <div class="flex flex-col w-full">
          <div class="mb-2 flex justify-between pl-1 tracking-wide">
            <h3 class="flex items-center gap-1 text-lg">
              <Fa icon={faBomb} size="sm" />
              Breaking changes in {data.plugin.name}
            </h3>
          </div>
          <div
            in:fade|global
            class="space-y-4 sm:grid sm:grid-flow-row auto-rows-max sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4 sm:space-y-0 md:grid-cols-3 lg:gap-x-8 sm:space-x-0"
          >
            {#each data.breaking as post}
              {#if post.breakingChange}
                <PostContainer {post} />
              {/if}
            {/each}
          </div>
        </div>
      {/if}
      {#if data.media.length > 0}
        <div class="flex flex-col w-full">
          <div class="mb-2 flex justify-between pl-1 tracking-wide">
            <h2 class="flex items-center gap-1 text-2xl font-semibold my-2">
              <Fa icon={faCameraRetro} size="sm" />
              Media
            </h2>
          </div>
          <div
            in:fade|global
            class="space-y-4 sm:grid sm:grid-flow-row auto-rows-max sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4 sm:space-y-0 md:grid-cols-3 lg:gap-x-8 sm:space-x-0"
          >
            {#each data.media as media}
              {#if getMediaType(media) === 'video'}
                <video
                  autoplay
                  muted
                  playsinline
                  class="rounded hover:cursor-pointer"
                  onclick={() => (selectedMedia = media)}
                  src={media.url}
                ></video>
              {:else}
                <button type="button" class="rounded" onclick={() => (selectedMedia = media)}>
                  <img class="rounded hover:cursor-pointer" alt="Plugin media" src={media.url} />
                </button>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
      {#if Object.keys(data.installInstructions).length > 0}
        <div class="flex flex-col w-full">
          <div class="mb-2 flex justify-between tracking-wide">
            <h2 class="flex items-center gap-1 text-2xl font-semibold my-2">
              Install instructions
            </h2>
          </div>
          <div
            class="flex items-center gap-2 p-2 text-sm px-4 w-full whitespace-normal bg-black/30 rounded mb-4 italic border-l-[6px] border-blue-400"
          >
            <Fa icon={faInfoCircle} />Dotfyle does not endorse any plugins. Install at your own
            risk.
          </div>
          <div class="flex w-full gap-2">
            {#each Object.keys(data.installInstructions).sort() as currPM}
              <button
                onclick={() => {
                  pluginManager = currPM;
                  instructions = data.installInstructions[currPM].instructions;
                }}
                class={`flex items-center text-sm sm:text-xs text-black px-4 py-1 rounded ${
                  pluginManager === currPM ? 'bg-accent-muted' : 'bg-white'
                }`}
              >
                {currPM}
              </button>
            {/each}
          </div>
          <div class="relative">
            <Highlight class="rounded" language={lua} code={instructions} />
            <button
              class="absolute right-4 top-4 border-[1px] border-transparent hover:border-accent-muted p-2 rounded"
              onclick={() => {
                copyToClipboard(instructions);
              }}
            >
              <Fa icon={faCopy} />
            </button>
          </div>
        </div>
      {/if}

      {#if data.configs.length > 0}
        <div class="flex flex-col w-full">
          <div class="mb-2 flex justify-between pl-1 tracking-wide">
            <h2 class="flex items-center gap-1 text-2xl font-semibold my-2">
              Developers using {data.plugin.name}
            </h2>
            <CoolLink
              href={`/neovim/configurations/top?plugins=${data.plugin.owner}/${data.plugin.name}`}
              text="more configs"
            />
          </div>

          <BigGridContainer>
            {#each data.configs as conf}
              <div in:fade|global>
                <NeovimConfigCard
                  slug={conf.slug}
                  repo={conf.repo}
                  owner={conf.owner}
                  avatar={conf.ownerAvatar}
                  initFile={conf.initFile}
                  root={conf.root}
                  stars={conf.stars.toString()}
                  pluginCount={conf.pluginCount.toString()}
                  loc={conf.linesOfCode}
                  links={conf.paths?.map(
                    (path) =>
                      `https://github.com/${conf.owner}/${conf.repo}/blob/${conf.sha ?? '-'}/${path}`
                  )}
                />
              </div>
            {/each}
          </BigGridContainer>
        </div>
      {/if}

      {#if categoryPlugins.length > 0}
        <div class="flex flex-col w-full">
          <div class="mb-2 flex justify-between pl-1 tracking-wide">
            <h2 class="flex items-center gap-1 text-2xl font-semibold my-2">
              Other <span class="px-2 py-0 bg-white text-black rounded">{data.plugin.category}</span
              > plugins
            </h2>
            <CoolLink
              href={`/neovim/plugins/top?categories=${data.plugin.category}`}
              text="more plugins"
            />
          </div>

          <BigGridContainer>
            {#each categoryPlugins as plugin}
              <div in:fade|global>
                <RepositoryCard
                  name="{plugin.owner}/{plugin.name}"
                  link="/plugins/{plugin.owner}/{plugin.name}"
                  description={plugin.shortDescription}
                  thumbnail={plugin.media?.[0]}
                >
                  {#snippet footer()}
                    <NeovimPluginMetaData
                      stars={plugin.stars.toString()}
                      configCount={plugin.configCount}
                      category={plugin.category}
                      addedLastWeek={plugin.addedLastWeek}
                      name="{plugin.owner}/{plugin.name}"
                    />
                  {/snippet}
                </RepositoryCard>
              </div>
            {/each}
          </BigGridContainer>
        </div>
      {/if}
    </div>
  </div>
  <div class="flex w-full flex-col gap-2 my-4">
    <Accordion>
      {#snippet title()}
        <div class="flex w-full justify-between items-center gap-1 mr-4">
          <h3 class="flex text-lg flex-grow">Plugin usage badge</h3>

          <div class="flex gap-2 items-center">
            <img
              alt="plugin usage"
              class="w-full h-full"
              src="/plugins/{data.plugin.owner}/{data.plugin.name}/shield?style={style}"
            />
          </div>
        </div>
      {/snippet}
      {#snippet content()}
        <div class="flex flex-col m-4 gap-2">
          <div class="flex w-full gap-1">
            {#each ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'] as currStyle}
              <button
                onclick={() => (style = currStyle)}
                class={`flex items-center text-sm sm:text-xs text-black px-4 py-1 rounded ${
                  currStyle === style ? 'bg-accent-muted' : 'bg-white'
                }`}
              >
                {currStyle}
              </button>
            {/each}

            <button
              class="flex w-auto gap-1 items-center text-sm sm:text-xs text-black px-4 py-1 rounded bg-white border-[1px] border-accent-muted hover:border-main"
              onclick={stopPropagation(() => copyToClipboard(badgesHtml))}
            >
              <Fa icon={faCopy} />

              Copy</button
            >
          </div>
          <Highlight class="text-sm tracking-wide rounded" code={badgesHtml} language={markdown} />
        </div>
      {/snippet}
    </Accordion>
  </div>
</div>
