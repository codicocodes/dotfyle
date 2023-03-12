<script>
	import { faRotate } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { DoubleBounce } from 'svelte-loading-spinners';
</script>

<div
	class="flex flex-col gap-2 p-4 overflow-hidden rounded-md border border-purple-300/20 bg-white/5 transition-colors w-80 md:w-auto lg:w-80 truncate text-ellipsis transition-colors"
>
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
