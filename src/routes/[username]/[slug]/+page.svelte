<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import CoolTextWithChildren from '$lib/components/CoolTextWithChildren.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import NeovimConfigMetaData from '$lib/components/NeovimConfigMetaData.svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';
	import { getInstallCommand, getRunCommand } from '$lib/installInstructions';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import {
		faChevronCircleRight,
		faChevronDown,
		faChevronUp,
		faStar
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { Highlight } from 'svelte-highlight';
	import { bash } from 'svelte-highlight/languages';
	import { githubDark } from 'svelte-highlight/styles';
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';
	import RepositoryCard from '$lib/components/RepositoryCard.svelte';
	import Accordion from '$lib/components/accordion.svelte';
	import NeovimPluginMetaData from '$lib/components/NeovimPluginMetaData.svelte';

	export let data: PageData;
	$: ({ config, plugins, languageServers } = data);

	let seeInstallInstructions = false;
	let seeLanguageServers = false;
</script>

<svelte:head>
	{@html githubDark}
	<title>{data.config.owner}/{data.config.repo} - Neovim configuration</title>
	<OpenGraph
		title="{data.config.owner}/{data.config.repo} - Neovim configuration"
		url="https://dotfyle.com/{data.config.owner}/{data.config.repo}"
		description="Plugin Manager, Leaderkey, Install instructions, Neovim plugins & Language Servers"
		image={data.config.ownerAvatar}
	/>
</svelte:head>

<div class="flex flex-col gap-4 px-4">
	<h1 class="text-xl flex gap-2 items-center font-semibold">
		<img
			alt=""
			class="inline h-8 w-8 rounded-full items-center"
			height="8"
			width="8"
			src={config.ownerAvatar}
		/>
		<a href="/{config.owner}">
			<CoolTextOnHover>
				{config.owner}
			</CoolTextOnHover>
		</a>
		/
		<a href="/{config.owner}/{config.slug}">
			<CoolTextOnHover>
				{config.repo}
			</CoolTextOnHover>
		</a>
	</h1>
	<div class="flex gap-1 items-center justify-between font-semibold">
		<div class="flex items-center gap-1">
			<Fa size="xs" icon={faStar} />
			{config.stars}
		</div>

		<a href="https://github.com/{config.owner}/{config.repo}" target="_blank">
			<Button text="GitHub" icon={faGithub} />
		</a>
	</div>
	<NeovimConfigMetaData
		syncing={false}
		pluginManager={config.pluginManager ?? 'unknown'}
		pluginCount={config.pluginCount?.toString()}
		root={config.root}
		initFile={config.initFile}
		isMonorepo={config.root ? 'yes' : 'no'}
		isFork={config.fork ? 'yes' : 'no'}
		leaderkey={config.leaderkey}
	/>
	{#if data.user?.id === config.userId}
		<CoolTextWithChildren>
			<GlossyCard>
				<div class="flex flex-col w-full gap-2">
					<a
						href="/{config.owner}/{config.slug}/readme"
						class="p-4 text-xl w-full flex justify-between items-center"
					>
						<span class="font-semibold">Generate README markdown</span>
						<div class="force-white-text">
							<Fa icon={faChevronCircleRight} size="sm" />
						</div>
					</a>
				</div>
			</GlossyCard>
		</CoolTextWithChildren>
	{/if}

	<Accordion>
		<span slot="title" class="font-semibold">Install instructions</span>

		<div slot="content" class="flex flex-col w-full gap-2">
			<div class="flex w-full items-center gap-2 font-medium text-sm px-4">
				<GlossyCard>
					<div
						class="flex items-center gap-2 p-2 font-medium text-sm px-4 w-full whitespace-normal"
					>
						Install requires Neovim 0.9+. Always review the code before installing a configuration.
					</div>
				</GlossyCard>
			</div>
			<span class="mx-4 font-medium tracking-wide whitespace-normal"
				>Clone the repository and install plugins</span
			>
			<Highlight class="mx-4 rounded" code={getInstallCommand(config)} language={bash} />
			<span class="mx-4 font-medium tracking-wide whitespace-normal"
				>Open Neovim with this configuration</span
			>
			<Highlight class="mx-4 pb-4 rounded" code={getRunCommand(config)} language={bash} />
		</div>
	</Accordion>
	<Accordion>
		<span slot="title" class="font-semibold">Language Servers</span>
		<div slot="content" class="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-4">
			{#each languageServers as ls}
				<GlossyCard>
					<div class="flex items-center gap-2 p-2 font-medium text-sm">
						{ls.name}
					</div>
				</GlossyCard>
			{/each}
		</div>
	</Accordion>

	<GlossyCard>
		<div class="flex flex-col w-full">
			<div class="p-4 text-xl w-full flex justify-between items-center">
				<span class="font-semibold">Plugins</span>
			</div>
			<div transition:slide class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 p-4">
				{#each plugins as plugin}
					<RepositoryCard
						username={plugin.owner}
						name={plugin.name}
						description={plugin.shortDescription}
						thumbnail={plugin.media?.[0]}
					>
						<NeovimPluginMetaData
							slot="footer"
							stars={plugin.stars.toString()}
							configCount={plugin.configCount}
							category={plugin.category}
						/>
					</RepositoryCard>
				{/each}
			</div>
		</div>
	</GlossyCard>
</div>
