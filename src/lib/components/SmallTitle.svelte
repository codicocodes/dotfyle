<script lang="ts">
	import CoolText from './CoolText.svelte';
	export let title: string;
</script>

<h1
	class="flex items-center justify-center text-xl sm:text-2xl h-full font-semibold tracking-wide"
>
	<CoolText text={title} />
</h1>
