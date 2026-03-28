<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<span
	class="hover:cursor-pointer hover:text-transparent hover:bg-clip-text hover:bg-gradient-primary w-full"
>
	{@render children?.()}
</span>
