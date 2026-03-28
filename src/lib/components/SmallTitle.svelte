<script lang="ts">
	import CoolText from './CoolText.svelte';
	interface Props {
		title: string;
	}

	let { title }: Props = $props();
</script>

<h1
	class="flex items-center justify-center text-xl sm:text-2xl h-full font-semibold tracking-wide"
>
	<CoolText text={title} />
</h1>
