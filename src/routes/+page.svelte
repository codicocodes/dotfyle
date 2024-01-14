<script lang="ts">
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import GithubLoginButton from '$lib/components/GithubLoginButton.svelte';
	import HeroTitle from '$lib/components/HeroTitle.svelte';
	import type { PageData } from './$types';
	import {
		faArrowDown,
		faChevronRight,
		faFileCode,
		faFire,
		faPuzzlePiece,
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

			{#if !data.user}
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
			<div class="w-full flex justify-center items-center">
				{#if !data.user}
					<GithubLoginButton />
				{:else}
					<div class="flex flex-col sm:flex-row gap-2">
						<a
							href={'/neovim/plugins/trending'}
							class={`bg-black/30 border-[1px] border-accent-muted hover:border-accent-bright text-sm font-semibold p-4 py-2 xl:px-6 xl:py-2 rounded-full flex gap-4 items-center hover:bg-gradient-main`}
						>
							<Fa icon={faPuzzlePiece} />
							Search plugins
							<Fa icon={faSearch} />
						</a>
						<a
							href={'/neovim/configurations/top'}
							class={`bg-black/30 border-[1px] border-accent-muted hover:border-accent-bright text-sm font-semibold p-4 py-2 xl:px-6 xl:py-2 rounded-full flex gap-4 items-center hover:bg-gradient-main`}
						>
							<Fa icon={faFileCode} />
							Search configs
							<Fa icon={faSearch} />
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="px-4 sm:px-4 flex flex-col">
		<div class="mb-2 flex justify-between pl-1 tracking-wide">
			<h3 class="flex items-center gap-1 text-lg">
				<Fa icon={faSeedling} size="sm" />
				newest plugins
			</h3>
			<a href="/neovim/plugins/new">
				<Button text="more new plugins" icon={faChevronRight} />
			</a>
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
				trending plugins
			</h3>
			<a href="/neovim/plugins/trending">
				<Button text="more trending plugins" icon={faChevronRight} />
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
				new configurations
			</h3>
			<a href="/neovim/plugins/new">
				<Button text="more configurations" icon={faChevronRight} />
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
</div>
