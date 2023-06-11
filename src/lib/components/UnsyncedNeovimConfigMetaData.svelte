<script lang="ts">
	import {
		faInfoCircle,
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { unsyncedConfig } from '$lib/stores/unsyncedConfigStore';
	import NeovimConfigMetaData from './NeovimConfigMetaData.svelte';
	export let syncing: boolean;
</script>

<h3 class="flex items-center gap-1 text-sm tracking-wide font-semibold pl-1">
	<Fa icon={faInfoCircle} />
	metadata
</h3>
<NeovimConfigMetaData 
  syncing={syncing}
  pluginManager={$unsyncedConfig.pluginManager ?? "unknown"}
  pluginCount={$unsyncedConfig.plugins ? $unsyncedConfig.plugins.length.toString() : "unknown"}
  root={$unsyncedConfig.root !== undefined ? ($unsyncedConfig.root ? $unsyncedConfig.root : "/") : "unknown" }
  initFile={$unsyncedConfig.initFile ?? "unknown"}
  isMonorepo={$unsyncedConfig.root !== undefined ? ($unsyncedConfig.root ? "yes" : "no") : "unknown"}
  isFork={$unsyncedConfig.fork !== undefined ? ($unsyncedConfig.fork ? "yes" : "no") : "unknown"}
  leaderkey="unknown"
/>
