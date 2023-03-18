<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import OuterLayout from '$lib/components/OuterLayout.svelte';
	import { humanizeAbsolute } from '$lib/utils';
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
	<div class="h-full grid grid-cols-10 gap-4 my-14 mx-8 max-w-5xl">
		<div class="col-span-10 sm:col-span-3">
			<!-- profile area -->
			<div in:fade class="flex sm:flex-col items-center justify-center gap-2 w-auto">
				<div class="flex sm:flex-col gap-2 items-center">
					<Avatar src={profile.avatarUrl} width="w-16 sm:72 md:48 xl:w-56" />
					<span class="flex text-xl font-medium items-center justify-center gap-2">
						{profile.username}
						<a href={`https://github.com/${profile.username}`} target="_blank">
							<Fa icon={faGithub} size="sm" />
						</a>
					</span>
				</div>
			</div>
      <div class="flex flex-col gap-2 mt-2">
			<span class="flex justify-center text-sm tracking-wide font-light">
				Joined {humanizeAbsolute(new Date(profile.createdAt))}
			</span>
			{#if me && me.id === profile.id}
				<div class="flex items-center justify-center">
					<a class="text-sm font-semibold tracking-wide" href="/add">
						<Button text="add config" icon={faPlus} loading={false} />
					</a>
				</div>
			{/if}
      </div>
		</div>
		<!-- user configs -->
		<div class="col-span-10 sm:col-span-7 w-full">
			<h3 in:fade class="flex items-center gap-1 text-xl font-semibold mb-2">Neovim configs</h3>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{#each configs as conf, _}
					<a href={`/${conf.owner}/${conf.slug}`} in:fade>
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
