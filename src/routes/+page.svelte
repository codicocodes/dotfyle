<script lang="ts">
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import GithubLoginButton from '$lib/components/GithubLoginButton.svelte';
	import HeroTitle from '$lib/components/HeroTitle.svelte';
	import type { PageData } from './$types';
	import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import CoolText from '$lib/components/CoolText.svelte';
	import CoolLink from '$lib/components/CoolLink.svelte';

	// navbar
	// profile page
	// dotfile page
	// add dotfile page (almost same as welcome)
	// add plugin page (kind of different?)
	// plugin page
	// plugin list
	// dotfile list
	// list of plugins by category on home page

	export let data: PageData;

console.log(data)
	const logout = async () => {
		await fetch('/api/auth', { method: 'DELETE' });
	};
</script>

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

<div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
<div class="mb-2 flex justify-between pl-1 tracking-wide">
	<h3 class="flex items-center gap-1 text-lg font-semibold">

  newest configs</h3>
  <CoolLink href="/search" text="see more configs" />
</div>

	<div>
		<div
			class="space-y-4 sm:grid sm:grid-flow-row auto-rows-max sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4 sm:space-y-0 md:grid-cols-3 lg:gap-x-8"
		>
			{#each data.configs as conf, _}
      <a href={`/${conf.owner}/${conf.slug}`}>
				<NeovimConfigCard
					repo={conf.repo}
					owner={conf.owner}
					avatar={conf.ownerAvatar}
					initFile={conf.initFile}
					root={conf.root}
					stars={conf.stars.toString()}
					pluginManager={conf.pluginManager ?? "unknown"}
					pluginCount={conf.pluginCount.toString()}
				/>
      </a>
			{/each}
		</div>
	</div>
</div>
