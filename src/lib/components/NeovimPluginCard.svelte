<script lang="ts">
	import Fa from 'svelte-fa';
	import { faBox, faCircle, faHashtag, faPuzzlePiece, faStar, faUserGroup } from '@fortawesome/free-solid-svg-icons';
	export let owner: string;
	export let name: string;
	export let stars: string;
	export let configCount: number;
	export let category: string;
	export let shortDescription: string;
</script>

<div
	class="h-full relative flex flex-col justify-between overflow-hidden rounded-md border border-green-300/25 bg-white/5 transition-colors w-full shadow-lg hover:shadow-green-300/25"
>
	<div
		class="h-full flex space-x-4 bg-white/10 p-2 pl-5 transition-colors hover:bg-white/20 items-start"
	>
		<div class="flex flex-col gap-1">
			<p class="text-sm font-semibold tracking-wide md:text-base">
				{owner}/{name}
			</p>
			<p class="text-xs font-medium tracking-wide md:text-sm">
				{shortDescription}
			</p>
		</div>
	</div>
	<div class="m-1 flex font-medium">
		<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
			<Fa icon={faStar} />
			{stars}
		</span>
		<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
			<Fa icon={faUserGroup} />
			{configCount}
		</span>
		<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
			<Fa icon={faHashtag} />
			{category}
		</span>
	</div>
</div>
