<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import CoolTextWithChildren from '$lib/components/CoolTextWithChildren.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import NeovimConfigMetaData from '$lib/components/NeovimConfigMetaData.svelte';
	import NeovimPluginCard from '$lib/components/NeovimPluginCard.svelte';
	import { getInstallCommand, getRunCommand } from '$lib/installInstructions';
	import { copyToClipboard } from '$lib/utils';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import {
		faChevronCircleRight,
		faChevronDown,
		faChevronUp,
		faCopy,
		faStar
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { Highlight } from 'svelte-highlight';
	import { bash, markdown } from 'svelte-highlight/languages';
	import { githubDark } from 'svelte-highlight/styles';
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ config, plugins, languageServers } = data);

	let seeInstallInstructions = false;
	let seeLanguageServers = false;
	let seeBadgeInstructions = false;

	let style = 'flat';
	$: badgesHtml = `<a href="https://dotfyle.com/${data.config.owner}/${data.config.slug}"><img src="https://dotfyle.com/${data.config.owner}/${data.config.slug}/badges/plugins?style=${style}" /></a>
<a href="https://dotfyle.com/${data.config.owner}/${data.config.slug}"><img src="https://dotfyle.com/${data.config.owner}/${data.config.slug}/badges/leaderkey?style=${style}" /></a>
<a href="https://dotfyle.com/${data.config.owner}/${data.config.slug}"><img src="https://dotfyle.com/${data.config.owner}/${data.config.slug}/badges/plugin-manager?style=${style}" /></a>`;
</script>

<svelte:head>
	{@html githubDark}
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
				/
				{config.root}
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

	{#if data.user?.id === config.userId}
		<GlossyCard>
			<div class="flex flex-col w-full gap-2">
				<button
					on:click={() => (seeBadgeInstructions = !seeBadgeInstructions)}
					class="p-4 text-xl w-full flex justify-between items-center"
				>
					<span class="font-semibold">Badges</span>
					<div class="force-white-text">
						<Fa icon={faChevronDown} size="sm" />
					</div>
				</button>
				{#if seeBadgeInstructions}
					<div class="flex flex-col w-full gap-2" transition:slide>
						<span class="px-4 whitespace-normal">
							If you don't want to use the generated readme, you can use just the Dotfyle badges. Select badge style, copy the markdown and paste them into your README.
						</span>
						<div class="flex w-full items-center gap-2 font-medium text-sm px-4">
							<div class="flex flex-col gap-6">
								<div class="flex w-full gap-2">
									{#each ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'] as currStyle}
										<GlossyCard>
											<button
												on:click={() => (style = currStyle)}
												class="p-2 px-4 {currStyle === style ? 'bg-green-400/25' : ''}"
											>
												{currStyle}
											</button>
										</GlossyCard>
									{/each}
									<GlossyCard>
										<button
											on:click={() => copyToClipboard(badgesHtml)}
											class="flex items-center gap-2 p-2 font-medium text-sm px-4 w-full whitespace-normal"
										>
											<Fa icon={faCopy} /> Copy Markdown
										</button>
									</GlossyCard>
								</div>

								<div class="flex w-full gap-2">
									{#each ['plugins', 'leaderkey', 'plugin-manager'] as badge}
										<img src="/{config.owner}/{config.slug}/badges/{badge}?style={style}" />
									{/each}
								</div>
							</div>
						</div>
						<Highlight class="m-4 rounded" code={badgesHtml} language={markdown} />
					</div>
				{/if}
			</div>
		</GlossyCard>
	{/if}
	<GlossyCard>
		<div class="flex flex-col w-full gap-2">
			<button
				on:click={() => (seeInstallInstructions = !seeInstallInstructions)}
				class="p-4 text-xl w-full flex justify-between items-center"
			>
				<span class="font-semibold">Install instructions</span>
				<Fa icon={!seeInstallInstructions ? faChevronDown : faChevronUp} size="sm" />
			</button>
			{#if seeInstallInstructions}
				<div class="flex flex-col w-full gap-2" transition:slide>
					<div class="flex w-full items-center gap-2 font-medium text-sm px-4">
						<GlossyCard>
							<div
								class="flex items-center gap-2 p-2 font-medium text-sm px-4 w-full whitespace-normal"
							>
								Install requires Neovim 0.9+. Always review the code before installing a
								configuration.
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
			{/if}
		</div>
	</GlossyCard>
	<GlossyCard>
		<div class="flex flex-col w-full">
			<button
				on:click={() => (seeLanguageServers = !seeLanguageServers)}
				class="p-4 text-xl w-full flex justify-between items-center"
			>
				<span class="font-semibold">Language Servers</span>
				<Fa icon={!seeLanguageServers ? faChevronDown : faChevronUp} size="sm" />
			</button>
			{#if seeLanguageServers}
				<div transition:slide class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-4">
					{#each languageServers as ls}
						<GlossyCard>
							<div class="flex items-center gap-2 p-2 font-medium text-sm">
								{ls.name}
							</div>
						</GlossyCard>
					{/each}
				</div>
			{/if}
		</div>
	</GlossyCard>
	<GlossyCard>
		<div class="flex flex-col w-full">
			<div class="p-4 text-xl w-full flex justify-between items-center">
				<span class="font-semibold">Plugins</span>
			</div>
			<div transition:slide class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 p-4">
				{#each plugins as plugin}
					<NeovimPluginCard
						owner={plugin.owner}
						name={plugin.name}
						stars={plugin.stars.toString()}
						configCount={plugin.configCount}
						category={plugin.category}
						shortDescription={plugin.shortDescription}
					/>
				{/each}
			</div>
		</div>
	</GlossyCard>
</div>
