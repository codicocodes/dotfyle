<script lang="ts">
	import type { InitFile } from '$lib/nvim-sync/services/init-file-finder';
	import {
		faBox,
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
	export let initFile: InitFile | undefined;
	export let syncing: boolean;
</script>

<GlossyCard>
	<div class="flex flex-col p-2 text-sm tracking-tight w-full gap-2">
		<p class="flex w-full items-center justify-between">
			<span class="flex items-center gap-1">
				<Fa icon={faBox} />
				plugin manager
			</span>
			<span class="flex items-center gap-1">
				{#if syncing}
					<DoubleBounce color="#15be97" size="8" />
				{/if}
				unknown
			</span>
		</p>

		<p class="flex w-full items-center justify-between">
			<span class="flex items-center gap-1">
				<Fa icon={faPuzzlePiece} />
				plugins
			</span>
			<span class="flex items-center gap-1">
				{#if syncing}
					<DoubleBounce color="#15be97" size="8" />
				{/if}
				unknown
			</span>
		</p>

		<p class="flex w-full items-center justify-between">
			<span class="flex items-center gap-1">
				<Fa icon={faFolderTree} />
				root
			</span>
			<span class="flex items-center gap-1">
				{initFile !== undefined ? `/${initFile.root}` : 'unknown'}
			</span>
		</p>

		<p class="flex w-full items-center justify-between">
			<span class="flex items-center gap-1">
				<Fa icon={faFileCode} />
				init file
			</span>
			<span class="flex items-center gap-1">
				{initFile !== undefined ? `${initFile.type}` : 'unknown'}
			</span>
		</p>

		<p class="flex w-full items-center justify-between">
			<span class="flex items-center gap-1">
				<Fa icon={faLayerGroup} />
				monorepo
			</span>
			<span class="flex items-center gap-1">
				{initFile !== undefined ? (initFile.root ? 'yes' : 'no') : 'unknown'}
			</span>
		</p>

    <p class="flex w-full items-center justify-between">
			<span class="flex items-center gap-1">
				<Fa icon={faCodeFork} />
				fork
			</span>
			<span class="flex items-center gap-1">
        unknown
			</span>
		</p>

		<p class="flex w-full items-center justify-between">
			<span class="flex items-center gap-1">
				<Fa icon={faDeleteLeft} />
				leaderkey
			</span>
			<span class="flex items-center gap-1">
				{#if syncing}
					<DoubleBounce color="#15be97" size="8" />
				{/if}
				unknown
			</span>
		</p>
	</div>
</GlossyCard>
