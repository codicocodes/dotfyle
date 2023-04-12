<script lang="ts">
	import Fa from 'svelte-fa';
	import { faBox, faCircle, faPuzzlePiece, faStar } from '@fortawesome/free-solid-svg-icons';
	import CoolTextOnHover from './CoolTextOnHover.svelte';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	export let owner: string;
	export let repo: string;
	export let initFile: string;
	export let root: string;
	export let avatar: string;
	export let stars: string;
	export let pluginManager: string;
	export let pluginCount: string;
	export let slug: string;
	export let showGithubLink: boolean;
</script>

<div
	class="relative flex flex-col justify-between overflow-hidden rounded-md border border-green-300/25 bg-white/5 transition-colors w-full shadow-lg hover:shadow-green-300/25"
>
	<div class="flex items-center space-x-2 bg-white/10 p-2 pl-5 transition-colors hover:bg-white/20">
		<img src={avatar} alt="" class="h-10 w-10 rounded-full" />
		<div class="text-sm md:text-base font-semibold tracking-wide">
			<CoolTextOnHover>
				<a href={`/${owner}/${slug}`}>
					{owner}/{repo}
				</a>
			</CoolTextOnHover>
			<span class="text-sm font-normal">{`/${root}`}</span>
		</div>
	</div>
	<div class="m-1 flex font-medium">
		<div class="flex grow">
			<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
				<Fa icon={faStar} />
				{stars}
			</span>
			<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
				<Fa icon={faCircle} />
				{initFile}
			</span>
			<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold lowercase">
				<Fa icon={faBox} />
				{pluginManager || 'unknown'}
			</span>
			<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
				<Fa icon={faPuzzlePiece} />
				{pluginCount || 'unknown'}
			</span>
		</div>
		<a
			class="flex items-center gap-1 mr-2"
			href={`https://github.com/${owner}/${repo}`}
			target="_blank"
		>
			<Fa icon={faGithub} />
			{#if showGithubLink}
				<span class="hidden sm:block font-semibold">
					<CoolTextOnHover>repository</CoolTextOnHover>
				</span>
			{/if}
		</a>
	</div>
</div>
