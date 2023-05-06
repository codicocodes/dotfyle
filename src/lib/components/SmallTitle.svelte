<script lang="ts">
	import CoolText from './CoolText.svelte';
	export let title: string;
</script>

<h1
	class="flex items-center justify-center text-2xl h-full font-semibold tracking-wide my-4 sm:my-12"
>
	<CoolText text={title} />
</h1>
