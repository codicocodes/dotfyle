<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import Fa from 'svelte-fa';
	import { faChevronCircleRight, faRss } from '@fortawesome/free-solid-svg-icons';
	import CoolText from '$lib/components/CoolText.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>{'This Week in Neovim | Neovim news'}</title>
	<OpenGraph
		title={'This Week in Neovim | Neovim news'}
		url="https://dotfyle.com/this-week-in-neovim"
		description="Neovim news and updates from the Neovim plugin ecosystem"
		image="/twin.png"
	/>
</svelte:head>

<div class="w-full flex flex-col items-center px-4">
	<div class="flex flex-col max-w-5xl w-full gap-4">
		<p class="flex text-xl font-light my-4">
			This Week In Neovim is a weekly newsletter with updates from the Neovim ecosystem, including
			new plugins and breaking changes.
		</p>

		<p class="text-xl font-light my-4 inline">
			TWiN was created by
			<a href="https://github.com/phaazon" target="_blank">
				<CoolText text="phaazon" />
			</a>
			who has decided to

			<a href="/this-week-in-neovim/46#update-twin">
				<CoolText text="move away from the project" />
			</a>

			💚 Thank you for everything you've done for the community!
		</p>
		<p class="text-xl font-light my-4 items-center gap-2 inline">
			<Fa class="inline mr-2" size="xs" icon={faRss} />
			An rss feed to consume TWiN can be found
			<a href="/this-week-in-neovim/rss.xml" target="_blank">
				<CoolText text="here." />
			</a>
		</p>

		<h2 class="font-semibold text-3xl">Past issues</h2>
		<div class="flex flex-col gap-4">
			{#each data.posts as post}
				<CoolTextOnHover>
					<GlossyCard>
						<div class="flex w-full p-4 whitespace-normal">
							<a
								class="flex w-full text-xl font-light justify-between"
								href="/this-week-in-neovim/{post.issue}"
							>
								<span class="min-w-[150px]">{new Date(post.createdAt).toLocaleDateString()} </span>
								<span class="hidden sm:flex gap-4 items-center text-right">
									{post.title}
									<Fa size="xs" class="force-white-text" icon={faChevronCircleRight} />
								</span>
								<span class="flex sm:hidden gap-4 items-center">
									Issue #{post.issue}
									<Fa size="xs" class="force-white-text" icon={faChevronCircleRight} />
								</span>
							</a>
						</div>
					</GlossyCard>
				</CoolTextOnHover>
			{/each}
		</div>
		<Pagination page={$page} next={data.pagination.next} previous={data.pagination.prev} />
	</div>
</div>
