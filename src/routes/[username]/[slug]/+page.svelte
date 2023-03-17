<script lang="ts">
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';
	import NeovimConfigMetaData from '$lib/components/NeovimConfigMetaData.svelte';
	import OuterLayout from '$lib/components/OuterLayout.svelte';
	import PluginList from '$lib/components/PluginList.svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
	const { config, plugins } = data;
</script>

<OuterLayout>
	<div class="h-full grid grid-cols-10 gap-4 my-14 mx-8 sm:px-24">
		<div class="col-span-10 lg:col-span-5">
			<!-- profile area -->
			<div in:fade class="flex sm:flex-col items-center justify-center gap-2 w-auto">
				<div class="flex flex-col gap-4 w-full">
					<NeovimConfigCard
						repo={config.repo}
						owner={config.owner}
						avatar={config.ownerAvatar}
						initFile={config.initFile}
						root={config.root}
						stars={config.stars.toString()}
						pluginManager={config.pluginManager ?? 'unknown'}
						pluginCount={config.pluginCount.toString()}
					/>
          <NeovimConfigMetaData 
            syncing={false}
            pluginManager={config.pluginManager ?? "unknown"}
            pluginCount={plugins.length.toString()}
            root={config.root}
            initFile={config.initFile}
            isMonorepo={config.root}
            isFork={config.fork ? "yes" : "no"}
          />
				</div>
			</div>
		</div>
		<!-- user configs -->
		<div class="col-span-10 lg:col-span-5 w-full">
      <PluginList plugins={plugins} />
		</div>
	</div>
</OuterLayout>
