<script lang="ts">
	import Fa from 'svelte-fa';
	import { faBox, faCircle, faPuzzlePiece, faStar } from '@fortawesome/free-solid-svg-icons';
	import type { NeovimConfig } from '$lib/types';
	export let config: NeovimConfig;
</script>

<div
	class="relative flex flex-col justify-between overflow-hidden rounded-md border border-green-300/25 bg-white/5 transition-colors w-full"
>
	<div class="flex items-center space-x-4 bg-white/10 p-2 pl-5 transition-colors hover:bg-white/20">
		<img src={config.ownerAvatar} alt="" class="h-10 w-10 rounded-full" />
		<div>
			<p class="text-lg font-medium md:text-xl">{config.owner}</p>
			{#if config.path}
				<p class="text-md font-medium md:text-lg truncate text-ellipsis">{config.name}{config.root ? `/${config.root}` : ""}</p>
			{/if}
		</div>
	</div>
	<div class="m-1 flex font-medium">
		<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
			<Fa icon={faStar} />
			{config.stars}
		</span>
		<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
			<Fa icon={faCircle} />
			{config.language}
		</span>
		<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
			<Fa icon={faBox} />
			{config.pluginManager}
		</span>
		<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
			<Fa icon={faPuzzlePiece} />
			{config.plugins}
		</span>
	</div>
</div>
