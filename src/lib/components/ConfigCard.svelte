<script lang="ts">
	import Fa from 'svelte-fa';
	import { faChevronCircleRight, faStar } from '@fortawesome/free-solid-svg-icons';
	import CoolTextOnHover from './CoolTextOnHover.svelte';
	export let avatar: string;
	export let owner: string;
	export let repo: string;
	export let stars: string;
	export let tools: string[];
	export let screenshot: string;
</script>

<div class="flex bg-white/10 px-4 py-3 rounded my-4">
	<div class="flex">
		<div class="flex flex-col gap-4 w-full">
			<div class="flex gap-2 items-center w-full">
				<img src={avatar} alt="" class="h-6 w-6 rounded-full" height="10" width="10" />
				<CoolTextOnHover>
				<span class="font-semibold">
					{owner}
				</span>
				</CoolTextOnHover>
				<span class="font-light"> / </span>
				<CoolTextOnHover>
				<span class="font-semibold">
					{repo}
				</span>
				</CoolTextOnHover>
			</div>
			<div class="flex gap-1 items-center flex-wrap">
				<span class="py-1 rounded-full text-xs flex gap-1 items-center font-semibold mr-2">
					<Fa icon={faStar} />
					{stars}
				</span>
				{#each tools.slice(0, 4) as tool}
					<span class="text-xs font-semibold font-semibold bg-white/20 px-2 py-0.5 rounded">
						{tool}
					</span>
				{/each}
			</div>
		</div>
	</div>

	<div class="flex flex-grow justify-end items-center">
		<div class="relative text-zinc-300 hover:text-white hover:cursor-pointer">
			<img class="flex flex-end rounded max-h-[50px] blur-[1px]" height="20px" src={screenshot} />
			<Fa class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" size="sm" icon={faChevronCircleRight} />
		</div>
	</div>
</div>
