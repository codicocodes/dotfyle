<script lang="ts">
	import { faCircle } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let name: string;

	export let selected: boolean;
</script>

<div
	class={`flex items-center gap-2 px-2 py-1 overflow-hidden rounded-md border border-purple-300/20 bg-white/5 transition-colors w-80 md:w-auto lg:w-80 truncate text-ellipsis ${
		selected ? '' : 'bg-white/5'
	} transition-colors`}
>
<Fa icon={faCircle} size="xs" class={selected && 'text-green-400'} />
	<span class="font-lg truncate text-ellipsis">
		{name}
	</span>
</div>
