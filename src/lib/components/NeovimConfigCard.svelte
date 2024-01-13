<script lang="ts">
	import Fa from 'svelte-fa';
	import { faCircle, faCode, faPuzzlePiece, faStar } from '@fortawesome/free-solid-svg-icons';
	import RepositoryCard from './RepositoryCard.svelte';
	export let owner: string;
	export let repo: string;
	export let initFile: string;
	export let root: string;
	export let avatar: string;
	export let stars: string;
	export let pluginCount: string;
	export let slug: string;
	export let loc: number;
</script>

<RepositoryCard
	{avatar}
	name="{owner}/{repo}"
	link="/{owner}/{slug}"
	description="/{root}"
	thumbnail={null}
	disableMinHeight
>
	<div slot="footer" class="flex font-medium mt-2">
		<div class="flex grow gap-4">
			<span
				title="GitHub stars"
				class="py-1 rounded-full text-xs flex gap-1 items-center font-semibold"
			>
				<Fa icon={faStar} />
				{stars}
			</span>
			<span
				title="Init file"
				class="py-1 rounded-full text-xs flex gap-1 items-center font-semibold"
			>
				<Fa icon={faCircle} />
				{initFile}
			</span>
			<span
				title="Number of installed plugins"
				class="py-1 rounded-full text-xs flex gap-1 items-center font-semibold"
			>
				<Fa icon={faPuzzlePiece} />
				{pluginCount || 'unknown'}
			</span>
			<span
				title="Lines of code"
				class="py-1 rounded-full text-xs flex gap-1 items-center font-semibold"
			>
				<Fa icon={faCode} />
				{loc}
			</span>
		</div>
	</div></RepositoryCard
>
