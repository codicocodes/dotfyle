<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CoolLink from '$lib/components/CoolLink.svelte';
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import { trpc } from '$lib/trpc/client';
	import { getMediaType, hasBeenOneDay, humanizeAbsolute, isAdmin } from '$lib/utils';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import {
		faArrowTrendUp,
		faBomb,
		faCameraRetro,
		faDeleteLeft,
		faRotate,
		faStar,
		faToggleOff,
		faToggleOn,
		faUsers,
		faX
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import PostContainer from '$lib/components/PostContainer.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { Media } from '@prisma/client';
	import OpenGraph from '$lib/components/OpenGraph.svelte';
	import RepositoryCard from '$lib/components/RepositoryCard.svelte';
	import BigGridContainer from '$lib/components/BigGridContainer.svelte';
	import NeovimPluginMetaData from '$lib/components/NeovimPluginMetaData.svelte';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	export let data: PageData;

	$: categoryPlugins = data.categoryPlugins.filter((p) => p.name != data.plugin.name).slice(0, 4);
	let syncingPlugin = false;

	let readme = '';

	$: {
		if (data.plugin.id) {
			readme = '';
		}
	}

	$: firstImage = data.media.filter((m) => getMediaType(m) === 'image')?.[0]?.url;

	let selectedMedia: Media | undefined;

	async function deleteMedia(id: number) {
		await trpc($page).deleteMedia.query({
			id
		});
	}
	async function toggleThumbnail(id: number) {
		await trpc($page).toggleThumbnail.query({
			id
		});
		if (selectedMedia && selectedMedia.id === id) {
			selectedMedia.thumbnail = !selectedMedia.thumbnail;
		}
	}
</script>

<svelte:head>
	<title>
		{data.plugin.owner}/{data.plugin.name} - Neovim plugin | Developers using {data.plugin.name} | Alternatives
		to {data.plugin.name}
	</title>
	<OpenGraph
		title="{data.plugin.owner}/{data.plugin.name} - Neovim plugin | Developers using {data.plugin
			.name} | Alternatives to {data.plugin.name}"
		url="https://dotfyle.com/plugins/{data.plugin.owner}/{data.plugin.name}"
		description={data.plugin.shortDescription}
		image={firstImage}
	/>
</svelte:head>

{#if selectedMedia}
	<Modal showModal={!!selectedMedia} onClose={() => (selectedMedia = undefined)}>
		{#if data.user && isAdmin(data.user)}
			<div class="flex gap-2 my-2">
				<Button on:click={() => deleteMedia(selectedMedia.id)} icon={faDeleteLeft} text="Delete" />
				<Button
					on:click={() => toggleThumbnail(selectedMedia.id)}
					icon={selectedMedia.thumbnail ? faToggleOff : faToggleOn}
					text={selectedMedia.thumbnail ? 'Remove as thumbnail' : 'Make into thumbnail'}
				/>
			</div>
		{/if}
		{#if getMediaType(selectedMedia) === 'video'}
			<video
				class="rounded:cursor-pointer"
				alt="video"
				src={selectedMedia.url}
				autoplay
				muted
				playsinline
			/>
		{:else}
			<img class="rounded:cursor-pointer" alt="" src={selectedMedia.url} />
		{/if}
	</Modal>
{/if}
<div class="w-full flex flex-col items-center h-full my-14 px-4">
	<div class="flex flex-col max-w-5xl w-full gap-2">
		<div class="flex flex-col gap-2">
			<h1 class="text-xl flex gap-2 items-center font-semibold">
				{#if data.owner}
					<img
						alt=""
						class="inline h-8 w-8 rounded-full items-center"
						height="8"
						width="8"
						src={data.owner.avatarUrl}
					/>
					<a href="/{data.owner.username}">
						<CoolTextOnHover>
							{data.plugin.owner}
						</CoolTextOnHover>
					</a>
				{:else}
					{data.plugin.owner}
				{/if}
				/
				<span>
					{data.plugin.name}
				</span>
			</h1>
			<h2 class="flex items-center text-base sm:text-lg font-medium tracking-wide gap-2">
				{data.plugin.shortDescription}
			</h2>
			<div class="flex flex-col sm:flex-row w-full items-center gap-4">
				<span
					class="items-center text-base sm:text-sm font-semibold tracking-wide gap-2 bg-white/40 px-2 py-1 rounded"
				>
					{data.plugin.category}
				</span>
				<span
					class="items-center text-base sm:text-sm font-semibold tracking-wide gap-2 bg-white/40 px-2 py-1 rounded"
				>
					{data.plugin.source}
				</span>
			</div>

			<div class="flex flex-col w-full gap-2">
				<div class="flex w-full justify-between">
					{#if data.plugin.lastSyncedAt}
						<span class="text-sm tracking-wide font-light">
							last synced {humanizeAbsolute(new Date(data.plugin.lastSyncedAt))}
						</span>
					{:else}
						<span class="flex items-center gap-2 text-lg tracking-wide font-light">
							<div class="text-red-500">
								<Fa icon={faX} size="sm" />
							</div>

							never synced
						</span>
					{/if}
					{#if data.user && (data.plugin.lastSyncedAt ? hasBeenOneDay(data.plugin.lastSyncedAt) || isAdmin(data.user) : true)}
						<div class="flex items-center gap-1">
							<Button
								on:click={async () => {
									syncingPlugin = true;
									data.plugin = await trpc($page).syncPlugin.query({
										owner: data.plugin.owner,
										name: data.plugin.name
									});
									syncingPlugin = false;
								}}
								text="sync"
								icon={faRotate}
								loading={syncingPlugin}
							/>
						</div>
					{/if}
				</div>
			</div>

			<div class="flex text-base sm:text-base font-semibold tracking-wide justify-between">
				<div class="flex gap-4">
					<span
						title="GitHub stars"
						class="py-1 rounded-full flex gap-1 items-center font-semibold"
					>
						<Fa icon={faStar} />
						{data.plugin.stars}
					</span>
					<span
						title="Total installs on Dotfyle"
						class="py-1 rounded-full flex gap-1 items-center font-semibold"
					>
						<Fa icon={faUsers} />
						{data.plugin.configCount}
					</span>
					<span
						title="Installs last week"
						class="py-1 rounded-full flex gap-1 items-center font-semibold"
					>
						<Fa icon={faArrowTrendUp} />
						{data.plugin.addedLastWeek}
					</span>
				</div>

				<a href="https://github.com/{data.plugin.owner}/{data.plugin.name}" target="_blank">
					<Button text="GitHub" icon={faGithub} />
				</a>
			</div>
		</div>
		<div class="flex flex-col w-full items-center justify-between gap-8">
			{#if data.breaking.length > 0}
				<div class="flex flex-col w-full">
					<div class="mb-2 flex justify-between pl-1 tracking-wide">
						<h3 class="flex items-center gap-1 text-lg font-semibold">
							<Fa icon={faBomb} size="sm" />
							breaking changes
						</h3>
					</div>
					<div
						in:fade
						class="space-y-4 sm:grid sm:grid-flow-row auto-rows-max sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4 sm:space-y-0 md:grid-cols-3 lg:gap-x-8 sm:space-x-0"
					>
						{#each data.breaking as post, _}
							{#if post.breakingChange}
								<PostContainer {post} />
							{/if}
						{/each}
					</div>
				</div>
			{/if}
			{#if data.media.length > 0}
				<div class="flex flex-col w-full">
					<div class="mb-2 flex justify-between pl-1 tracking-wide">
						<h3 class="flex items-center gap-1 text-lg font-semibold lowercase">
							<Fa icon={faCameraRetro} size="sm" />
							media
						</h3>
						{#if data.user && isAdmin(data.user)}
							<div class="flex">
								<Button
									on:click={async () => {
										await Promise.all(data.media.map((m) => deleteMedia(m.id)));
									}}
									icon={faDeleteLeft}
									text="Delete all images"
								/>
							</div>
						{/if}
					</div>
					<div
						in:fade
						class="space-y-4 sm:grid sm:grid-flow-row auto-rows-max sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4 sm:space-y-0 md:grid-cols-3 lg:gap-x-8 sm:space-x-0"
					>
						{#each data.media as media}
							{#if getMediaType(media) === 'video'}
								<video
									autoplay
									muted
									playsinline
									class="rounded hover:cursor-pointer"
									on:click={() => (selectedMedia = media)}
									src={media.url}
								/>
							{:else}
								<img
									class="rounded hover:cursor-pointer"
									on:click={() => (selectedMedia = media)}
									alt=""
									src={media.url}
								/>
							{/if}
						{/each}
					</div>
				</div>
			{/if}

			<div class="flex flex-col w-full">
				<div class="mb-2 flex justify-between pl-1 tracking-wide">
					<h3 class="flex items-center gap-1 text-lg font-semibold lowercase">
						neovim configs using {data.plugin.name}
					</h3>
					<CoolLink
						href={`/neovim/configurations/top?plugins=${data.plugin.owner}/${data.plugin.name}`}
						text="more configs"
					/>
				</div>

				{#if data.configs.length > 0}
					<BigGridContainer>
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
									loc={conf.linesOfCode}
								/>
							</div>
						{/each}
					</BigGridContainer>
				{/if}
			</div>

			<div class="flex flex-col w-full">
				<div class="mb-2 flex justify-between pl-1 tracking-wide">
					<h3 class="flex items-center gap-1 text-lg font-semibold">
						other neovim {data.plugin.category} plugins
					</h3>
					<CoolLink
						href={`/neovim/plugins/top?categories=${data.plugin.category}`}
						text="more plugins"
					/>
				</div>

				<BigGridContainer>
					{#each categoryPlugins as plugin, _}
						<div in:fade>
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
						</div>
					{/each}
				</BigGridContainer>
			</div>
		</div>
	</div>
</div>
