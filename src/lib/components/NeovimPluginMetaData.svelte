<script lang="ts">
	import {
		faArrowTrendUp,
		faAt,
		faChevronDown,
		faChevronUp,
		faExternalLink,
		faStar,
		faUsers
	} from '@fortawesome/free-solid-svg-icons';

	import Fa from 'svelte-fa';
	import CoolTextOnHover from './CoolTextOnHover.svelte';

	export let stars: string;
	export let configCount: number;
	export let category: string;
	export let addedLastWeek: number;
	export let links: string[] = [];

	let isOpen = false;

	function handleSeeLinks() {
		isOpen = !isOpen;
	}
</script>

<div class="flex font-medium justify-between">
	<div class="flex gap-4">
		<span title="GitHub stars" class="py-1 rounded-full flex gap-1 items-center font-semibold">
			<Fa icon={faStar} />
			{stars}
		</span>
		<span
			title="Total installs on Dotfyle"
			class="py-1 rounded-full flex gap-1 items-center font-semibold"
		>
			<Fa icon={faUsers} />
			{configCount}
		</span>
		<span
			title="Installs last week"
			class="py-1 rounded-full flex gap-1 items-center font-semibold"
		>
			<Fa icon={faArrowTrendUp} />
			{addedLastWeek}
		</span>
		<span class="px-2 rounded-full text-xs flex gap-1 items-center font-medium">
			{category}
		</span>
	</div>
	{#if links.length > 0}
		<button
			class="relative px-2 rounded-full text-xs flex gap-1 items-center font-medium bg-white text-black hover:bg-accent-muted"
			on:click|stopPropagation={handleSeeLinks}
			on:click|stopPropagation
			data-umami-event="Plugin Mention - Open"
			title="Mentions of the plugin in this config"
		>
			{#if isOpen}
				<div
					class="absolute left-[-1px] top-10 z-50 bg-accent-muted text-white rounded"
					id="user-menu"
					on:blur={() => (isOpen = false)}
				>
					<div class="flex flex-col w-full h-full bg-base-900 sm:bg-transparent">
						{#each links as link}
							<CoolTextOnHover>
								<a
									data-umami-event="Plugin Mention - Navigate"
									class="px-4 py-2 flex gap-2 items-center"
									target="_blank"
									href={link}
								>
									<div class="force-white-text">
										<Fa icon={faExternalLink} class="text-base-100" />
									</div>
									{link.replace(
										/(https:\/\/github.com\/)([a-zA-Z0-9]+)\/[a-zA-Z0-9]+\/blob\/-\//,
										''
									)}
								</a>
							</CoolTextOnHover>
						{/each}
					</div>
				</div>
			{/if}
			<Fa icon={faAt} />
			{links.length}
			{links.length === 1 ? 'mention' : 'mentions'}
			<Fa icon={isOpen ? faChevronUp : faChevronDown} />
		</button>
	{/if}
</div>
