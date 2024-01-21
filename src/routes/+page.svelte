<script lang="ts">
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import HeroTitle from '$lib/components/HeroTitle.svelte';
	import type { PageData } from './$types';
	import {
		faArrowDown,
		faCalendarDay,
		faChevronRight,
		faFire,
		faNewspaper,
		faRss,
		faSearch,
		faSeedling,
		faStar
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import CoolText from '$lib/components/CoolText.svelte';
	import BigGridContainer from '$lib/components/BigGridContainer.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';
	import RepositoryCard from '$lib/components/RepositoryCard.svelte';
	import NeovimPluginMetaData from '$lib/components/NeovimPluginMetaData.svelte';
	import Button from '$lib/components/Button.svelte';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { copyToClipboard } from '$lib/utils';
	import { session } from '$lib/stores/session';

	export let data: PageData;
</script>

<svelte:head>
	<title>Dotfyle | Neovim Plugins & Neovim News</title>
	<OpenGraph
		title="Dotfyle | Neovim Plugin Search | Neovim Config Search | Neovim News"
		description="Find new plugins, trending plugins & popular plugins. Search for Neovim configurations by plugin manager, plugins or language cervers. Read the lateset Neovim News in This Week in Neovim."
		url="https://dotfyle.com"
	/>
</svelte:head>

<div class="flex flex-col gap-8 my-4">
	<div class="flex flex-col justify-center items-center">
		<div class="py-12 sm:py-8 md:py-12 lg:py-14 xl:py-12 2xl:py-28">
			<div class="flex w-full items-center justify-center">
				<a
					href="https://github.com/codicocodes/dotfyle"
					class="shadow-xl shadow-white/20 hover:shadow-main bg-transparent rounded-full"
				>
					<Button icon={faStar} text="Star on GitHub" iconPosition="left" />
				</a>
			</div>

			<HeroTitle>
				Discover and share <CoolText text="Neovim" /> plugins
			</HeroTitle>

			{#if !$session}
				<div class="flex justify-center items-center my-4 md:my-6 lg:my-8 xl:my-12">
					<div
						class="max-w-md px-4 sm:max-w-2xl sm:px-6 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-7xl"
					>
						<h2
							class="text-center font-light tracking-tight text-white sm:text-lg sm:tracking-tight xl:text-xl xl:tracking-tight"
						>
							Signup with GitHub to add your config
						</h2>
					</div>
				</div>
			{/if}
			<div class="flex justify-center mb-12">
				<Fa icon={faArrowDown} />
			</div>
			<div class="w-full flex flex-col sm:flex-row justify-center items-center gap-2">
				{#if !$session}
					<a
						href="/api/auth/github"
						class="bg-transparent rounded-full shadow-xl shadow-white/30 hover:shadow-main"
					>
						<Button text="Login | Signup" icon={faGithub} />
					</a>
				{/if}
				<a href="/neovim/plugins/trending" class="bg-transparent rounded-full">
					<Button text="Search plugins" icon={faSearch} />
				</a>
				<a href="/neovim/configurations/top" class="bg-transparent rounded-full">
					<Button text="Search configurations" icon={faSearch} />
				</a>
			</div>
		</div>
	</div>

	<div class="px-4 sm:px-4 flex flex-col">
		<div class="mb-2 flex justify-between pl-1 tracking-wide">
			<h3 class="flex items-center gap-1 text-lg">
				<Fa icon={faSeedling} size="sm" />
				<span class="hidden sm:inline">new plugins</span>
			</h3>

			<div class="flex gap-1">
				<button
					title="An RSS feed to consume new Neovim plugins on Dotfyle"
					class="flex items-center justify-center w-8 h-8 text-white rounded-full flex-grow-1 text-sm border-[1px] border-accent-muted hover:border-secondary"
					on:click={() => copyToClipboard('https://dotfyle.com/neovim/plugins/rss.xml')}
				>
					<Fa class="inline" size="xs" icon={faRss} />
				</button>
				<a href="/neovim/plugins/new" class="inline">
					<Button text="new plugins" icon={faChevronRight} />
				</a>
			</div>
		</div>

		{#await data.loading.newPlugins}
			<BigGridContainer>
				{#each [null, null, null, null, null, null] as _n, _}
					<GlossyCard loading>
						<div class="min-h-[92px]" />
					</GlossyCard>
				{/each}
			</BigGridContainer>
		{:then res}
			<BigGridContainer>
				{#each res.data as plugin, _}
					<RepositoryCard
						name="{plugin.owner}/{plugin.name}"
						link="/plugins/{plugin.owner}/{plugin.name}"
						description={plugin.shortDescription}
						thumbnail={plugin.media?.[0]}
					>
						<NeovimPluginMetaData
							slot="footer"
							stars={plugin.stars.toString()}
							configCount={plugin.configCount}
							category={plugin.category}
							addedLastWeek={plugin.addedLastWeek}
						/>
					</RepositoryCard>
				{/each}
			</BigGridContainer>
		{/await}
	</div>

	<div class="px-4 sm:px-4 flex flex-col">
		<div class="mb-2 flex justify-between pl-1 tracking-wide">
			<h3 class="flex items-center gap-1 text-lg">
				<Fa icon={faFire} size="sm" />
				<span class="hidden sm:inline">trending plugins</span>
			</h3>
			<a href="/neovim/plugins/trending">
				<Button text="trending plugins" icon={faChevronRight} />
			</a>
		</div>

		{#await data.loading.trendingPlugins}
			<BigGridContainer>
				{#each [null, null, null, null, null, null] as _n, _}
					<GlossyCard loading>
						<div class="min-h-[92px]" />
					</GlossyCard>
				{/each}
			</BigGridContainer>
		{:then res}
			<BigGridContainer>
				{#each res.data as plugin, _}
					<RepositoryCard
						name="{plugin.owner}/{plugin.name}"
						link="/plugins/{plugin.owner}/{plugin.name}"
						description={plugin.shortDescription}
						thumbnail={plugin.media?.[0]}
					>
						<NeovimPluginMetaData
							slot="footer"
							stars={plugin.stars.toString()}
							configCount={plugin.configCount}
							category={plugin.category}
							addedLastWeek={plugin.addedLastWeek}
						/>
					</RepositoryCard>
				{/each}
			</BigGridContainer>
		{/await}
	</div>

	<div class="px-4 sm:px-4 flex flex-col">
		<div class="mb-2 flex justify-between pl-1 tracking-wide">
			<h3 class="flex items-center gap-1 text-lg">
				<Fa icon={faSeedling} size="sm" />
				<span class="hidden sm:inline">new configurations</span>
			</h3>
			<a href="/neovim/configurations/new">
				<Button text="configurations" icon={faChevronRight} />
			</a>
		</div>

		{#await data.loading.configs}
			<BigGridContainer>
				{#each [null, null, null, null, null, null] as _n, _}
					<GlossyCard loading>
						<div class="min-h-[92px]" />
					</GlossyCard>
				{/each}
			</BigGridContainer>
		{:then configs}
			<BigGridContainer>
				{#each configs as conf, _}
					<NeovimConfigCard
						slug={conf.slug}
						repo={conf.repo}
						owner={conf.owner}
						avatar={conf.ownerAvatar}
						initFile={conf.initFile}
						root={conf.root}
						stars={conf.stars.toString()}
						pluginManager={conf.pluginManager ?? 'unknown'}
						pluginCount={conf.pluginCount.toString()}
						loc={conf.linesOfCode}
					/>
				{/each}
			</BigGridContainer>
		{/await}
	</div>

	<div class="px-4 sm:px-4 flex flex-col">
		<div class="mb-2 flex justify-between pl-1 tracking-wide">
			<h3 class="flex items-center gap-1 text-lg">
				<Fa icon={faNewspaper} size="sm" />
				<span class="hidden sm:inline">This Week in Neovim</span>
			</h3>
			<div class="flex gap-1">
				<button
					title="An RSS feed to consume This Week in Neovim"
					class="flex items-center justify-center w-8 h-8 text-white rounded-full flex-grow-1 text-sm border-[1px] border-accent-muted hover:border-secondary"
					on:click={() => copyToClipboard('https://dotfyle.com/this-week-in-neovim/rss.xml')}
				>
					<Fa class="inline" size="xs" icon={faRss} />
				</button>
				<a href="/neovim/configurations/new">
					<Button text="news" icon={faChevronRight} />
				</a>
			</div>
		</div>

		<BigGridContainer>
			{#each data.loading.twinPosts as issue, _}
				<RepositoryCard
					name=""
					link="/this-week-in-neovim/{issue.issue}"
					description={issue.title}
					disableMinHeight
				>
					<div slot="footer" class="flex gap-4 my-2 text-sm items-center">
						<div class="flex gap-2 items-center justify-center">
							<Fa icon={faNewspaper} />
							Issue #{issue.issue}
						</div>

						<div class="flex gap-2 items-center justify-center">
							<Fa icon={faCalendarDay} />
							{new Date(issue.createdAt).toLocaleDateString()}
						</div>
					</div>
				</RepositoryCard>
			{/each}
		</BigGridContainer>
	</div>
</div>
