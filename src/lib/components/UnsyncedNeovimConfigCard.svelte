<script lang="ts">
	import { unsyncedConfig } from '$lib/stores/unsyncedConfigStore';
	import NeovimConfigCard from './NeovimConfigCard.svelte';
	export let avatar: string;
</script>

<NeovimConfigCard
	slug={$unsyncedConfig.slug ?? ''}
	repo={$unsyncedConfig.repo ?? 'unknown'}
	owner={$unsyncedConfig.owner ?? 'unknown'}
	{avatar}
	initFile={$unsyncedConfig.initFile ?? 'unknown'}
	root={$unsyncedConfig.root ?? 'unknown'}
	stars={$unsyncedConfig.stars?.toString() ?? 'unknown'}
	pluginCount={$unsyncedConfig.plugins?.length.toString() ?? 'unknown'}
	loc={0}
/>
