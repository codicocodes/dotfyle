<script lang="ts">
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import OuterLayout from '$lib/components/OuterLayout.svelte';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { Avatar } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
	const { profile, configs, me } = data;
</script>

<OuterLayout>
	<div class="h-full grid grid-cols-5 gap-4 my-14 mx-8">
		<div class="col-span-5 sm:col-span-2">
			<!-- profile area -->
			<div in:fade class="flex sm:flex-col items-center justify-center gap-2 w-auto">
				<div class="flex sm:flex-col gap-4">
					<Avatar src={profile.avatarUrl} width="w-16 sm:72 md:48 xl:w-56" />
					<span class="flex text-xl font-medium items-center justify-center gap-2">
						{profile.username}
						<a href={`https://github.com/${profile.username}`} target="_blank">
							<Fa icon={faGithub} size="sm" />
						</a>
					</span>
				</div>
			</div>
			{#if me && me.id === profile.id}
      <div class="flex items-center justify-center">
				<a
					href="/add-config"
					class="px-6 bg-white/30 hover:bg-white/50 text-xs sm:text-regular font-semibold tracking-wide py-2 rounded-full flex gap-2 items-center justify-around my-4 max-w-xs"
				>
					Add config
					<Fa icon={faPlus} />
				</a>
        </div>
			{/if}
		</div>
		<!-- user configs -->
		<div class="col-span-5 sm:col-span-3 w-full sm:mt-24">
			<h3 in:fade={{ duration: 2000 }} class="flex items-center gap-1 text-xl font-semibold mb-2">
				Neovim configs
			</h3>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{#each configs as conf, _}
					<a href={`/${conf.owner}/${conf.slug}`} in:fade={{ duration: 2000 }}>
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
			</div>
		</div>
	</div>
</OuterLayout>