<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div
	class="sm:grid sm:grid-flow-row auto-rows-max sm:grid-cols-2 space-y-2 sm:space-y-0 md:grid-cols-3 gap-2"
>
	{@render children?.()}
</div>
