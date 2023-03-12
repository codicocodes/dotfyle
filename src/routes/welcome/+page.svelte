<script>
	import HeroTitle from '$lib/components/HeroTitle.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	console.log(data);
</script>

<!-- header -->
<div class="mx-auto xl:max-w-7xl">
	<div class="flex flex-col justify-center items-center">
		<HeroTitle>
			Welcome to <span
				class="text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-green-500"
				>Dotfyle</span
			>
		</HeroTitle>
	</div>
</div>
