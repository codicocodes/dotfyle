<script lang="ts">
	import { unsyncedConfig } from '$lib/stores/unsyncedConfigStore';
	import NeovimConfigCard from './NeovimConfigCard.svelte';
	export let avatar: string;
</script>

<NeovimConfigCard
	repo={$unsyncedConfig.repo ?? "unknown"}
	owner={$unsyncedConfig.owner ?? "unknown"}
	avatar={avatar}
	initFile={$unsyncedConfig.initFile ?? "unknown"}
	root={$unsyncedConfig.root ?? "unknown"}
	stars={$unsyncedConfig.stars?.toString() ?? "unknown"}
	pluginManager={$unsyncedConfig.pluginManager ?? "unknown"}
	pluginCount={$unsyncedConfig.plugins?.length.toString() ?? "unknown"}
/>
