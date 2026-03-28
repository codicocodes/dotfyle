<script lang="ts">
	interface Props {
		text: string;
	}

	let { text }: Props = $props();
</script>

<span class="text-transparent bg-clip-text bg-gradient-primary">
	{text}
</span>
