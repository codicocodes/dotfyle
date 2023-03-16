<script lang="ts">
	import {
		faBox,
		faCodeFork,
		faDeleteLeft,
		faFileCode,
		faFolderTree,
		faInfoCircle,
		faLayerGroup,
		faPuzzlePiece
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { DoubleBounce } from 'svelte-loading-spinners';
	import GlossyCard from './GlossyCard.svelte';
	import { unsyncedConfig } from '$lib/stores/unsyncedConfigStore';
	export let syncing: boolean;
</script>

<h3 class="flex items-center gap-1 text-sm tracking-wide font-semibold pl-1">
	<Fa icon={faInfoCircle} />
	metadata
</h3>
<GlossyCard>
	<div class="flex flex-col p-2 text-sm tracking-tight w-full gap-2">
		<p class="flex w-full items-center justify-between">
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
				{$unsyncedConfig?.pluginManager ?? 'unknown'}
			</span>
		</p>

		<p class="flex w-full items-center justify-between">
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
				{$unsyncedConfig.plugins ? $unsyncedConfig.plugins.length : 'unknown'}
			</span>
		</p>

		<p class="flex w-full items-center justify-between">
			<span class="flex items-center gap-1">
				<div class="w-[20px]">
					<Fa icon={faFolderTree} />
				</div>
				root
			</span>
			<span class="flex items-center gap-1">
				{$unsyncedConfig?.root !== undefined ? `/${$unsyncedConfig.root}` : 'unknown'}
			</span>
		</p>

		<p class="flex w-full items-center justify-between">
			<span class="flex items-center gap-1">
				<div class="w-[20px]">
					<Fa icon={faFileCode} />
				</div>
				init file
			</span>
			<span class="flex items-center gap-1">
				{$unsyncedConfig?.initFile !== undefined ? `${$unsyncedConfig.initFile}` : 'unknown'}
			</span>
		</p>

		<p class="flex w-full items-center justify-between">
			<span class="flex items-center gap-1">
				<div class="w-[20px]">
					<Fa icon={faLayerGroup} />
				</div>
				monorepo
			</span>
			<span class="flex items-center gap-1">
				{$unsyncedConfig !== undefined ? ($unsyncedConfig.root ? 'yes' : 'no') : 'unknown'}
			</span>
		</p>

		<p class="flex w-full items-center justify-between">
			<span class="flex items-center gap-1">
				<div class="w-[20px]">
					<Fa icon={faCodeFork} />
				</div>
				fork
			</span>
			<span class="flex items-center gap-1">
				{$unsyncedConfig?.fork !== undefined ? ($unsyncedConfig.fork ? 'yes' : 'no') : 'unknown'}
			</span>
		</p>

		<p class="flex w-full items-center justify-between">
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
				unknown
			</span>
		</p>
	</div>
</GlossyCard>
