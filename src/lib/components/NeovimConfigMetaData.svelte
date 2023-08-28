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
	import { DoubleBounce } from 'svelte-loading-spinners';
	import GlossyCard from './GlossyCard.svelte';

	export let syncing: boolean;
	export let pluginManager: string;
	export let pluginCount: string;
	export let root: string;
	export let initFile: string;
	export let isMonorepo: string;
	export let isFork: string;
	export let leaderkey: string;
	export let loc: number;
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
					<DoubleBounce color="#15be97" size="8" />
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
					<DoubleBounce color="#15be97" size="8" />
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
					<DoubleBounce color="#15be97" size="8" />
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
					<DoubleBounce color="#15be97" size="8" />
				{/if}
				<kbd class="px-2 py-1 border rounded-lg bg-gray-600 text-gray-100 border-gray-500"
					>{leaderkey}</kbd
				>
			</span>
		</div>
	</div>
</GlossyCard>
