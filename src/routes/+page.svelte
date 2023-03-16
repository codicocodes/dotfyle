<script lang="ts">
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import GithubLoginButton from '$lib/components/GithubLoginButton.svelte';
	import HeroTitle from '$lib/components/HeroTitle.svelte';
	import type { PageData } from './$types';
	import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import CoolText from '$lib/components/CoolText.svelte';

	export let data: PageData;

	const logout = async () => {
		await fetch('/api/auth', { method: 'DELETE' });
	};

</script>

<div class="mx-auto xl:max-w-7xl">
	<div class="flex flex-col justify-center items-center">
		<div class="py-12 sm:py-8 md:py-12 lg:py-14 xl:py-12 2xl:py-28">
			<HeroTitle>
				Discover and share <CoolText text="Neovim"/> configs
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

			<div 

      class="flex justify-center mb-8">
				<Fa icon={faArrowDown} />
			</div>
			<div class="w-full flex justify-center items-center">
				<GithubLoginButton />
				<!-- <button on:click={logout}> logout </button> -->
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
		<div class="mb-4 md:text-center">
			<h2 class="text-xl font-semibold md:text-2xl lg:text-2xl">Community configs</h2>
		</div>

		<div>
			<div
				class="space-y-4 sm:grid sm:grid-flow-row auto-rows-max sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4 sm:space-y-0 md:grid-cols-3 lg:gap-x-8"
			>
				{#each data.configs as conf, _}
					<NeovimConfigCard 
            repo={conf.name}
            owner={conf.owner}
            avatar={conf.ownerAvatar}
            initFile={conf.initFile}
            root={conf.root}
            stars={conf.stars.toString()}
            pluginManager={conf.pluginManager}
            pluginCount={conf.plugins.toString()}
          />
				{/each}
			</div>
		</div>
	</div>
</div>
