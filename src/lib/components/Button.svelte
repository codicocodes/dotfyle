<script lang="ts">
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let text: string;
	export let icon: IconDefinition;
</script>

<button
	class="bg-white/30 text-xs font-medium p-2 py-1 xl:px-2 xl:py-1 rounded flex gap-1 items-center shadow-lg hover:shadow-green-300/25 hover:bg-gradient-to-br hover:from-cyan-500 hover:to-green-500"
	type="submit"
>
	{text}
	<Fa class="ml-1" size="xs" {icon} />
</button>
