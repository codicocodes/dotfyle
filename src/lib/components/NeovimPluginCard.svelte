<script lang="ts">
	import CoolTextOnHover from './CoolTextOnHover.svelte';
	import NeovimPluginMetaData from './NeovimPluginMetaData.svelte';
	export let owner: string;
	export let name: string;
	export let stars: string;
	export let configCount: number;
	export let category: string;
	export let shortDescription: string;
	export let size: 'sm' | 'lg' = 'sm';
</script>

<div
	class="h-full relative flex flex-col justify-between overflow-hidden rounded-md border border-green-300/25 bg-white/10 hover:bg-white/20 transition-colors w-full shadow-lg hover:shadow-green-300/25"
>
	<div class="h-full flex space-x-4 p-2 pl-5 transition-colors items-start">
		<div class="w-full flex flex-col gap-1">
			<div class="flex w-fulll justify-between">
				<CoolTextOnHover>
					<a
						href={`/plugins/${owner}/${name}`}
						class="text-sm font-semibold tracking-wide md:text-base"
					>
						{owner}/{name}
					</a>
				</CoolTextOnHover>
				{#if size !== 'sm'}
					<div class="hidden sm:flex">
						<NeovimPluginMetaData {stars} {configCount} {category} />
					</div>
				{/if}
			</div>
			{#if shortDescription}
				<p class="text-xs font-medium tracking-wide md:text-sm">
					{shortDescription}
				</p>
			{/if}
		</div>
	</div>
	<div class={size === "sm" ? "px-2" : "sm:hidden"}> 
		<NeovimPluginMetaData {stars} {configCount} {category} />
	</div>
</div>
