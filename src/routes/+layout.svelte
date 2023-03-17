<script>
	import CoolText from '$lib/components/CoolText.svelte';
	import OuterLayout from '$lib/components/OuterLayout.svelte';
	import '../app.css';
</script>

<div class="mt-2">
	<div class="flex items-center justify-between w-full px-8 gap-4">
		<a href="/" class="text-2xl tracking-tight font-black">
			<CoolText text="dotfyle" />
		</a>
		<div class="text-sm font-semibold">
			<span> profile </span>
		</div>
	</div>
	<OuterLayout>
		<slot />
	</OuterLayout>
</div>

<style global>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
</style>
