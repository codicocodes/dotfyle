<script lang="ts">
  import {
    faBox,
    faCode,
    faCodeFork,
    faDeleteLeft,
    faFileCode,
    faFolderTree,
    faLayerGroup,
    faPuzzlePiece
  } from '@fortawesome/free-solid-svg-icons';

  import Fa from 'svelte-fa';
  import GlossyCard from './GlossyCard.svelte';

  interface Props {
    syncing: boolean;
    pluginManager: string;
    pluginCount: string;
    root: string;
    initFile: string;
    isMonorepo: string;
    isFork: string;
    leaderkey: string;
    loc: number;
  }

  let {
    syncing,
    pluginManager,
    pluginCount,
    root,
    initFile,
    isMonorepo,
    isFork,
    leaderkey,
    loc
  }: Props = $props();
</script>

<GlossyCard>
  <div class="flex flex-col p-2 text-sm w-full gap-2 font-semibold text-regular tracking-wide">
    <div class="flex w-full items-center justify-between">
      <span class="flex items-center gap-1">
        <div class="w-[20px]">
          <Fa icon={faBox} />
        </div>
        plugin manager
      </span>
      <span class="flex items-center gap-1">
        {#if syncing}
          <div class="w-2 h-2 rounded-full bg-main animate-pulse"></div>
        {/if}
        {pluginManager}
      </span>
    </div>

    <div class="flex w-full items-center justify-between">
      <span class="flex items-center gap-1">
        <div class="w-[20px]">
          <Fa icon={faPuzzlePiece} />
        </div>
        plugins
      </span>
      <span class="flex items-center gap-1">
        {#if syncing}
          <div class="w-2 h-2 rounded-full bg-main animate-pulse"></div>
        {/if}
        {pluginCount}
      </span>
    </div>

    <div class="flex w-full items-center justify-between">
      <span class="flex items-center gap-1">
        <div class="w-[20px]">
          <Fa icon={faFolderTree} />
        </div>
        root
      </span>
      <span class="flex items-center gap-1">
        {root}
      </span>
    </div>

    <div class="flex w-full items-center justify-between">
      <span class="flex items-center gap-1">
        <div class="w-[20px]">
          <Fa icon={faFileCode} />
        </div>
        init file
      </span>
      <span class="flex items-center gap-1">
        {initFile}
      </span>
    </div>

    <div class="flex w-full items-center justify-between">
      <span class="flex items-center gap-1">
        <div class="w-[20px]">
          <Fa icon={faCode} />
        </div>
        lines of code
      </span>
      <span class="flex items-center gap-1">
        {#if syncing}
          <div class="w-2 h-2 rounded-full bg-main animate-pulse"></div>
        {/if}
        <span class="flex items-center gap-1">
          {loc}
        </span>
      </span>
    </div>

    <div class="flex w-full items-center justify-between">
      <span class="flex items-center gap-1">
        <div class="w-[20px]">
          <Fa icon={faLayerGroup} />
        </div>
        monorepo
      </span>
      <span class="flex items-center gap-1">
        {isMonorepo}
      </span>
    </div>

    <div class="flex w-full items-center justify-between">
      <span class="flex items-center gap-1">
        <div class="w-[20px]">
          <Fa icon={faCodeFork} />
        </div>
        fork
      </span>
      <span class="flex items-center gap-1">
        {isFork}
      </span>
    </div>

    <div class="flex w-full items-center justify-between">
      <span class="flex items-center gap-1">
        <div class="w-[20px]">
          <Fa icon={faDeleteLeft} />
        </div>
        leaderkey
      </span>
      <span class="flex items-center gap-1">
        {#if syncing}
          <div class="w-2 h-2 rounded-full bg-main animate-pulse"></div>
        {/if}
        <kbd class="px-2 py-1 border rounded-lg bg-base-600 text-base-100 border-base-500"
          >{leaderkey}</kbd
        >
      </span>
    </div>
  </div>
</GlossyCard>
