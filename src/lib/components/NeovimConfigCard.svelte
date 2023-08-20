<script lang="ts">
	import Fa from 'svelte-fa';
	import { faBox, faCircle, faPuzzlePiece, faStar } from '@fortawesome/free-solid-svg-icons';
	import CoolTextOnHover from './CoolTextOnHover.svelte';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import RepositoryCard from './RepositoryCard.svelte';
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

<RepositoryCard
  avatar={avatar}
	name="{owner}/{repo}"
	link="/{owner}/{slug}"
	description="/{root}"
	thumbnail={null}
	disableMinHeight
>
	<div slot="footer" class="flex font-medium mt-2">
		<div class="flex grow gap-2">
			<span class="py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
				<Fa icon={faStar} />
				{stars}
			</span>
			<span class="py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
				<Fa icon={faCircle} />
				{initFile}
			</span>
			<span class="py-1 rounded-full text-xs flex gap-1 items-center font-semibold lowercase">
				<Fa icon={faBox} />
				{pluginManager || 'unknown'}
			</span>
			<span class="py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
				<Fa icon={faPuzzlePiece} />
				{pluginCount || 'unknown'}
			</span>
		</div>
	</div></RepositoryCard
>
