<script lang="ts">
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import GithubLoginButton from '$lib/components/GithubLoginButton.svelte';
	import HeroTitle from '$lib/components/HeroTitle.svelte';
	import type { PageData } from './$types';
	import {
		faArrowDown,
		faChartSimple,
		faPaintbrush,
		faSeedling
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import CoolText from '$lib/components/CoolText.svelte';
	import CoolLink from '$lib/components/CoolLink.svelte';
	import NeovimPluginCard from '$lib/components/NeovimPluginCard.svelte';
	import BigGridContainer from '$lib/components/BigGridContainer.svelte';

	// ⌛ navbar
	// ✅ profile page
	// ✅ dotfile page
	// ✅ add dotfile page (almost same as welcome)
	// ❌ add plugin page (kind of different?)
	// ✅ plugin page
	// search page
	// ⌛list of plugins by category on home page

	export let data: PageData;

	const logout = async () => {
		await fetch('/api/auth', { method: 'DELETE' });
	};
</script>

<div class="flex flex-col gap-4">
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
					Signup with GitHub to add your config
				</h2>
			</div>
		</div>

		<div class="flex justify-center mb-8">
			<Fa icon={faArrowDown} />
		</div>
		<div class="w-full flex justify-center items-center">
			<GithubLoginButton />
			<!-- <button on:click={logout}> logout </button> -->
		</div>
	</div>
</div>

<div class="max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col">
	<div class="mb-2 flex justify-between pl-1 tracking-wide">
		<h3 class="flex items-center gap-1 text-lg font-semibold">
			<Fa icon={faSeedling} size="sm" />
			new configs
		</h3>
		<CoolLink href="/search" text="more configs" />
	</div>

	<BigGridContainer>
		{#each data.configs as conf, _}
			<a href={`/${conf.owner}/${conf.slug}`}>
				<NeovimConfigCard
					repo={conf.repo}
					owner={conf.owner}
					avatar={conf.ownerAvatar}
					initFile={conf.initFile}
					root={conf.root}
					stars={conf.stars.toString()}
					pluginManager={conf.pluginManager ?? 'unknown'}
					pluginCount={conf.pluginCount.toString()}
				/>
			</a>
		{/each}
	</BigGridContainer>
</div>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col">
	<div class="mb-2 flex justify-between pl-1 tracking-wide gap-2">
		<h3 class="flex items-center gap-1 text-lg font-semibold">
			<Fa icon={faChartSimple} size="sm" />

			popular plugins
		</h3>
		<CoolLink href="/search" text="more plugins" />
	</div>

	<BigGridContainer>
		{#each data.plugins as plugin, _}
			<a href={`/plugins/${plugin.owner}/${plugin.name}`}>
				<NeovimPluginCard
					owner={plugin.owner}
					name={plugin.name}
          stars={plugin.stars.toString()}
					configCount={plugin.configCount}
					category={plugin.category}
					shortDescription={plugin.shortDescription}
				/>
			</a>
		{/each}
	</BigGridContainer>
</div>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col pb-8">
	<div class="mb-2 flex justify-between pl-1 tracking-wide gap-2">
		<h3 class="flex items-center gap-1 text-lg font-semibold">
			<Fa icon={faPaintbrush} size="sm" />
			colorschemes
		</h3>
		<CoolLink href="/search" text="more colorschemes" />
	</div>

	<BigGridContainer>
		{#each data.colorschemes.slice(0, 3) as plugin, _}
			<a href={`/plugins/${plugin.owner}/${plugin.name}`}>
				<NeovimPluginCard
					owner={plugin.owner}
					name={plugin.name}
          stars={plugin.stars.toString()}
					configCount={plugin.configCount}
					category={plugin.category}
					shortDescription={plugin.shortDescription}
				/>
			</a>
		{/each}
	</BigGridContainer>
</div>
</div>
