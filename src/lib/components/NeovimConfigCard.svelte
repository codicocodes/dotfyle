<script lang="ts">
	import Fa from 'svelte-fa';
	import { faBox, faChevronRight, faCircle, faPuzzlePiece, faStar } from '@fortawesome/free-solid-svg-icons';
	import { unsyncedConfig } from '$lib/stores/unsyncedConfigStore';
	import CoolText from './CoolText.svelte';
	export let avatar: string;
</script>

<div
	class="relative flex flex-col justify-between overflow-hidden rounded-md border border-green-300/25 bg-white/5 transition-colors w-full"
>
	<div class="flex items-center space-x-4 bg-white/10 p-2 pl-5 transition-colors hover:bg-white/20">
		<img src={avatar} alt="" class="h-10 w-10 rounded-full" />
		<div>
			<p class="text-lg font-medium md:text-xl">{$unsyncedConfig.owner}</p>
      <p class="text-md font-medium md:text-lg truncate text-ellipsis">{$unsyncedConfig.repo}{$unsyncedConfig.root ? `/${$unsyncedConfig.root}` : ""}</p>
		</div>
	</div>
	<div class="m-1 flex font-medium">
		<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
			<Fa icon={faStar} />
			{$unsyncedConfig.stars}
		</span>
		<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
			<Fa icon={faCircle} />
			{$unsyncedConfig.initFile}
		</span>
		<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
			<Fa icon={faBox} />
			{$unsyncedConfig.pluginManager ?? "unknown"}
		</span>
		<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
			<Fa icon={faPuzzlePiece} />
			{$unsyncedConfig.plugins ? $unsyncedConfig.plugins.length : "unknown"}
		</span>
	</div>
</div>
