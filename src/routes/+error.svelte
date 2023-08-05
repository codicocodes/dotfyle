<script lang="ts">
	import { page } from '$app/stores';
	import SmallTitle from '$lib/components/SmallTitle.svelte';
	function is404(message?: string) {
		return message?.includes('404');
	}
</script>

<div class="w-full flex items-center justify-center">
	{#if is404($page.error?.message)}
		<SmallTitle title="Not Found" />
  {:else}
		<SmallTitle title="Error" />
	{/if}
</div>
