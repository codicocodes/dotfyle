<script lang="ts">
	import { faCircle } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import GlossyCard from './GlossyCard.svelte';

	export let name: string;

	export let selected: boolean;
</script>

<div class="w-80 md:w-auto">
	<GlossyCard>
		<div
			class={`py-1 sm:py-2 flex items-center gap-2 px-2 py-1 w-full truncate text-ellipsis ${
				selected ? '' : 'bg-white/5'
			}`}
		>
			<Fa icon={faCircle} size="xs" class={selected && 'text-primary-400'} />
			<span class="font-lg truncate text-ellipsis">
				{name}
			</span>
		</div>
	</GlossyCard>
</div>
