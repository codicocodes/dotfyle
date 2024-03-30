<script lang="ts">
	import Fa from 'svelte-fa';
	import {
		faAt,
		faChevronDown,
		faChevronUp,
		faCircle,
		faCode,
		faExternalLink,
		faPuzzlePiece,
		faStar
	} from '@fortawesome/free-solid-svg-icons';
	import RepositoryCard from './RepositoryCard.svelte';
	import CoolTextOnHover from './CoolTextOnHover.svelte';
	export let owner: string;
	export let repo: string;
	export let initFile: string;
	export let root: string;
	export let avatar: string;
	export let stars: string;
	export let pluginCount: string;
	export let slug: string;
	export let loc: number;
	export let links: string[] = [];
	let isOpen = false;
	function handleSeeLinks() {
		isOpen = !isOpen;
	}
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
		{#if links && links.length > 0}
			<button
				class="relative px-2 rounded-lg text-xs flex gap-1 items-center font-medium bg-white text-black hover:bg-accent-muted"
				on:click|stopPropagation={handleSeeLinks}
				on:click|stopPropagation
				data-umami-event="Plugin Search Mention - Open"
				title="Mentions of the plugin in this config"
			>
				{#if isOpen}
					<div
						class="absolute right-0 top-10 z-50 bg-accent-muted text-white rounded"
						id="user-menu"
						on:blur={() => (isOpen = false)}
					>
						<div class="flex flex-col w-full h-full bg-base-900 sm:bg-transparent">
							{#each links as link}
								<CoolTextOnHover>
									<a
										data-umami-event="Plugin Search Mention - Navigate"
										class="px-4 py-2 flex gap-2 items-center"
										target="_blank"
										href={link}
									>
										<div class="force-white-text">
											<Fa icon={faExternalLink} class="text-base-100" />
										</div>
										<span class="whitespace-nowrap">
											{link.replace(
												/(https:\/\/github.com\/)([a-zA-Z0-9]+)\/[a-zA-Z0-9]+\/blob\/([a-zA-Z0-9-]+)\//,
												''
											)}
										</span>
									</a>
								</CoolTextOnHover>
							{/each}
						</div>
					</div>
				{/if}
				<Fa icon={faAt} />
				<span class="flex gap-1">
					{links.length}
					<span class="hidden sm:flex items-center gap-1">
						{links.length === 1 ? 'mention' : 'mentions'}
						<Fa icon={isOpen ? faChevronUp : faChevronDown} />
					</span>
				</span>
			</button>
		{/if}
	</div>
</RepositoryCard>
