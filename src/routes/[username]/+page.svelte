<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';
	import OuterLayout from '$lib/components/OuterLayout.svelte';
	import { humanizeAbsolute } from '$lib/utils';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { Avatar } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import RepositoryCard from '$lib/components/RepositoryCard.svelte';
	import NeovimPluginMetaData from '$lib/components/NeovimPluginMetaData.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.profile.username} - Neovim configugurations | Authored Neovim plugins</title>
	<OpenGraph
		title={data.profile.username}
		url="https://dotfyle.com/{data.profile.username}"
		image={data.profile.avatarUrl}
		description="Dotfiles | Neovim configurations | Authored plugins"
	/>
</svelte:head>

<OuterLayout>
	<div class="h-full grid grid-cols-10 gap-4 my-14 mx-8 max-w-5xl">
		<div class="col-span-10 sm:col-span-3">
			<!-- profile area -->
			<div in:fade class="flex sm:flex-col items-center justify-center gap-2 w-auto">
				<div class="flex sm:flex-col gap-2 items-center">
					<Avatar src={data.profile.avatarUrl} width="w-16 sm:72 md:48 xl:w-56" />
					<span class="flex text-xl font-medium items-center justify-center gap-2">
						{data.profile.username}
						<a href={`https://github.com/${data.profile.username}`} target="_blank">
							<Fa icon={faGithub} size="sm" />
						</a>
					</span>
				</div>
			</div>
			<div class="flex flex-col gap-2 mt-2">
				<span class="flex justify-center text-sm tracking-wide font-light">
					Joined {humanizeAbsolute(new Date(data.profile.createdAt))}
				</span>
				{#if data.me && data.me.id === data.profile.id}
					<div class="flex items-center justify-center">
						<a class="text-sm font-semibold tracking-wide" href="/add">
							<Button text="add config" icon={faPlus} loading={false} />
						</a>
					</div>
				{/if}
			</div>
		</div>
		<div class="col-span-10 sm:col-span-7 w-full">
			<!-- user configs -->
			<div class="flex flex-col gap-1">
				<h3 in:fade class="flex items-center gap-1 text-xl font-semibold mb-2">
					Neovim configurations
				</h3>
				<div class="grid grid-cols-1 lg:grid-cols-1 gap-4">
					{#each data.configs as conf, _}
						<div in:fade>
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
						</div>
					{/each}
				</div>

				{#if data.plugins.length > 0}
					<div class="flex flex-col gap-1 mt-4">
						<!-- authored plugins -->
						<h3 in:fade class="flex items-center gap-1 text-xl font-semibold">
							Authored Neovim plugins
						</h3>
						<p class="text-lg font-light">
							{data.profile.username} has authored {data.plugins.length} Neovim plugins. Their plugins
							have a total of {data.plugins.reduce((count, curr) => count + curr.configCount, 0)} installs
							across Dotfyle.
						</p>
						<div class="grid grid-cols-1 lg:grid-cols-1 gap-4">
							{#each data.plugins as plugin, _}
								<div in:fade>
									<RepositoryCard
										username={plugin.owner}
										name={plugin.name}
										description={plugin.shortDescription}
										thumbnail={plugin.media[0]}
									>
										<NeovimPluginMetaData
											slot="footer"
											stars={plugin.stars.toString()}
											configCount={plugin.configCount}
											category={plugin.category}
										/>
									</RepositoryCard>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div class="col-span-10 sm:col-span-7 w-full" />
	</div>
</OuterLayout>
