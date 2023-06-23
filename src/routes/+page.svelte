<script lang="ts">
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import GithubLoginButton from '$lib/components/GithubLoginButton.svelte';
	import HeroTitle from '$lib/components/HeroTitle.svelte';
	import type { PageData } from './$types';
	import {
		faArrowDown,
		faBomb,
		faFileCode,
		faFire,
		faPuzzlePiece,
		faSearch,
		faSeedling
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import CoolText from '$lib/components/CoolText.svelte';
	import CoolLink from '$lib/components/CoolLink.svelte';
	import NeovimPluginCard from '$lib/components/NeovimPluginCard.svelte';
	import BigGridContainer from '$lib/components/BigGridContainer.svelte';
	import PostCard from '$lib/components/PostCard.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Discover and share neovim configs</title>
	<meta
		name="description"
		content="Search and discover neovim plugins and share your neovim config"
	/>
</svelte:head>

<div class="flex flex-col gap-8 my-4">
	<div class="flex flex-col justify-center items-center">
		<div class="py-12 sm:py-8 md:py-12 lg:py-14 xl:py-12 2xl:py-28">
			<HeroTitle>
				Discover and share <CoolText text="Neovim" /> configs
			</HeroTitle>

			<div class="flex justify-center items-center my-4 md:my-6 lg:my-8 xl:my-12">
				<div
					class="max-w-md px-4 sm:max-w-2xl sm:px-6 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-7xl"
				>
					<h2
						class="text-center font-semibold tracking-tight text-white sm:text-lg sm:tracking-tight lg:text-xl xl:text-2xl xl:tracking-tight"
					>
						{#if !data.user}
							Signup with GitHub to add your config
						{:else}
							Search for plugins and configs
						{/if}
					</h2>
				</div>
			</div>

			<div class="flex justify-center mb-8">
				<Fa icon={faArrowDown} />
			</div>
			<div class="w-full flex justify-center items-center">
				{#if !data.user}
					<GithubLoginButton />
				{:else}
					<div class="flex flex-col sm:flex-row gap-2">
						<a
							href={'/plugins'}
							class={`bg-white/30 text-sm font-semibold p-4 py-2 xl:px-6 xl:py-2 rounded-full flex gap-4 items-center hover:bg-gradient-to-br hover:from-cyan-500 hover:to-green-500 shadow-xl hover:shadow-green-300/25`}
						>
							<Fa icon={faPuzzlePiece} />
							Search plugins
							<Fa icon={faSearch} />
						</a>
						<a
							href={'/configs'}
							class={`bg-white/30 text-sm font-semibold p-4 py-2 xl:px-6 xl:py-2 rounded-full flex gap-4 items-center hover:bg-gradient-to-br hover:from-cyan-500 hover:to-green-500 shadow-xl hover:shadow-green-300/25`}
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

	<div class="max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col">
		<div class="mb-2 flex justify-between pl-1 tracking-wide">
			<h3 class="flex items-center gap-1 text-lg font-semibold">
				<Fa icon={faBomb} size="sm" />
				breaking changes
			</h3>
		</div>
		<BigGridContainer>
			{#each data.breaking as post, _}
				{#if post.breakingChange}
					<PostCard
            date={new Date(post.createdAt)}
						url="/plugins/{post.breakingChange.plugin.owner}/{post.breakingChange.plugin.name}"
						title="Breaking change in {post.breakingChange?.plugin.name}"
						text={post.title}
					/>
				{/if}
			{/each}
		</BigGridContainer>
	</div>

	<div class="max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col">
		<div class="mb-2 flex justify-between pl-1 tracking-wide">
			<h3 class="flex items-center gap-1 text-lg font-semibold">
				<Fa icon={faSeedling} size="sm" />
				new configs
			</h3>
			<CoolLink href="/configs" text="more configs" />
		</div>

		<BigGridContainer>
			{#each data.configs as conf, _}
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
					showGithubLink={false}
				/>
			{/each}
		</BigGridContainer>
	</div>

	<div class="max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col">
		<div class="mb-2 flex justify-between pl-1 tracking-wide">
			<h3 class="flex items-center gap-1 text-lg font-semibold">
				<Fa icon={faSeedling} size="sm" />
				new plugins
			</h3>
			<CoolLink href="/plugins?sort=new" text="more plugins" />
		</div>

		<BigGridContainer>
			{#each data.newPlugins as plugin, _}
				<NeovimPluginCard
					owner={plugin.owner}
					name={plugin.name}
					stars={plugin.stars.toString()}
					configCount={plugin.configCount}
					category={plugin.category}
					shortDescription={plugin.shortDescription}
				/>
			{/each}
		</BigGridContainer>
	</div>

	<div class="max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col">
		<div class="mb-2 flex justify-between pl-1 tracking-wide">
			<h3 class="flex items-center gap-1 text-lg font-semibold">
				<Fa icon={faFire} size="sm" />
				trending plugins
			</h3>
			<CoolLink href="/plugins?sort=trending" text="more plugins" />
		</div>

		<BigGridContainer>
			{#each data.trendingPlugins as plugin, _}
				<NeovimPluginCard
					owner={plugin.owner}
					name={plugin.name}
					stars={plugin.stars.toString()}
					configCount={plugin.configCount}
					category={plugin.category}
					shortDescription={plugin.shortDescription}
				/>
			{/each}
		</BigGridContainer>
	</div>
</div>
