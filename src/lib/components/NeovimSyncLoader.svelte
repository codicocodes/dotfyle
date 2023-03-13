<script>
	import { faRotate } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { DoubleBounce } from 'svelte-loading-spinners';
	import GlossyCard from './GlossyCard.svelte';
</script>

<GlossyCard>
<div class="flex flex-col p-4 gap-2 w-80">
	<h2 class="flex items-center gap-2 text-lg font-medium">
		<Fa icon={faRotate} size="sm" />
		Syncing your config
	</h2>
	<div class="text-md font-light">
		<div class="flex items-center gap-2">
			<DoubleBounce color="#15be97" size="20" />
			<span> init file </span>
		</div>
		<div class="flex items-center gap-2">
			<DoubleBounce color="#15be97" size="20" />
			<span> plugin manager </span>
		</div>
		<div class="flex items-center gap-2">
			<DoubleBounce color="#15be97" size="20" />
			<span> plugins </span>
		</div>
	</div>
</div>
</GlossyCard>
