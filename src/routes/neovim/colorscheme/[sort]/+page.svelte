<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Pagination from '$lib/components/Pagination.svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';
	import { faStar, faUsers } from '@fortawesome/free-solid-svg-icons';
	import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';
	import Fa from 'svelte-fa';
	import { getMediaType } from '$lib/utils';
	import PluginSearchNavigation from '$lib/components/PluginSearchNavigation.svelte';
	import SearchHeader from '$lib/components/SearchHeader.svelte';

	export let data: PageData;

	$: ogThumbnail = data.plugins.flatMap(p => p.media).find(m => getMediaType(m) === 'image')

</script>

<svelte:head>
	<title>{data.content.ogTitle}</title>
	<OpenGraph
		title={data.content.ogTitle}
		description={data.content.ogDescription}
		url="https://dotfyle.com/neovim/plugins/{$page.params.sort}"
		image={ogThumbnail?.url}
	/>
</svelte:head>

<div class="w-full flex flex-col items-center px-4">
	<div class="flex flex-col max-w-5xl w-full">
		<div class="flex flex-col gap-2 my-2 mb-4">
			<SearchHeader
				content={data.content}
				navigation={data.navigation}
				pagination={data.pagination}
			/>
			<PluginSearchNavigation />
		</div>

		<div class="grid grid-cols-10 sm:gap-4 max-w-5xl text-xl">
			<div class="col-span-10 sm:col-span-10 flex flex-col gap-2 overscroll-none">
				<div class="flex flex-col gap-4">
					{#each data.plugins as plugin}
						<ShowcaseCard
							name="{plugin.owner}/{plugin.name}"
							link="/plugins/{plugin.owner}/{plugin.name}"
							description={plugin.shortDescription}
							thumbnail={plugin.media?.[0]}
						>
							<div slot="footer" class="flex gap-4 font-medium text-base">
								<span class="py-1 rounded-full flex gap-1 items-center font-semibold">
									<Fa icon={faStar} />
									{plugin.stars}
								</span>
								<span class="py-1 rounded-full flex gap-1 items-center font-semibold">
									<Fa icon={faUsers} />
									{plugin.configCount}
								</span>
							</div>
						</ShowcaseCard>
					{/each}
				</div>

				<Pagination
					page={$page}
					next={$page.data.pagination.next}
					previous={$page.data.pagination.prev}
				/>
			</div>
		</div>
	</div>
</div>
