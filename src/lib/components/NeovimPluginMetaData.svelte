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
	export let name: string;

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
		{#if configCount === 0}
			<span
				title="Total installs on Dotfyle"
				class="py-1 rounded-full flex gap-1 items-center font-semibold"
			>
				<Fa icon={faUsers} />
				{configCount}
			</span>
		{/if}
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
	<div class="flex flex-grow justify-end gap-2">
		{#if configCount > 0}
			<a
				class="relative px-2 rounded-lg text-xs flex gap-1 items-center font-medium bg-white text-black hover:bg-accent-muted"
				href="/neovim/configurations/top?plugins={name}"
			>
				<Fa icon={faUsers} />
				{configCount} <span class="hidden sm:inline">configs </span>
			</a>
		{/if}
		{#if links.length > 0}
			<button
				class="relative px-2 rounded-lg text-xs flex gap-1 items-center font-medium bg-white text-black hover:bg-accent-muted"
				on:click|stopPropagation={handleSeeLinks}
				on:click|stopPropagation
				data-umami-event="Plugin Mention - Open"
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
										data-umami-event="Plugin Mention - Navigate"
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
</div>
