<script lang="ts">
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import { page } from '$app/stores';
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import SmallTitle from '$lib/components/SmallTitle.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

  let search = $page.url.searchParams.get('q') ?? '';

	$: filteredConfig = data.configs.filter((p) => {
		const searchable =
			p.owner +
			p.repo +
			p.root +
			p.initFile +
			p.pluginManager +
			`${p.repo}/${p.root}/${p.initFile}` +
			`${p.repo} ${p.root} ${p.initFile}`;

		return searchable.toLowerCase().includes(search.toLowerCase());
	});
</script>

<div class="w-full flex flex-col items-center px-8">
	<div class="flex flex-col max-w-5xl w-full gap-4">
		<SmallTitle title="Find Neovim configs" />
		<div class="flex items-center justify-center mb-4">
			<input
				bind:value={search}
				class="w-full sm:w-1/2 p-1 sm:p-4 rounded-lg text-black text-lg font-semibold focus:outline-none focus:border-green-500 shadow-xl focus:shadow-green-300/25 focus:ring-1 focus:ring-green-500 bg-white/80"
			/>
		</div>
		<div class="flex flex-col h-[calc(100vh-340px)] sm:h-[calc(100vh-320px)]">
			<!-- 
          we need to use a virtual list otherwise rerendering is too heavy
          only way i got it to work was with 100vh - 420px to ensure we don't have double scroll y bars
          if improving this ensure that there is not double scrollbars on either mobile or desktop
      -->
			<VirtualList items={filteredConfig} let:item>
				<div class="my-2">
					<NeovimConfigCard
						slug={item.slug}
						repo={item.repo}
						owner={item.owner}
						avatar={item.ownerAvatar}
						initFile={item.initFile}
						root={item.root}
						stars={item.stars.toString()}
						pluginManager={item.pluginManager ?? 'unknown'}
						pluginCount={item.pluginCount.toString()}
						showGithubLink={false}
					/>
				</div>
			</VirtualList>
		</div>
	</div>
</div>
