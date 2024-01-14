<script lang="ts">
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let text: string;
	export let icon: IconDefinition;
	export let event: string | undefined = undefined;
	export let loading = false;
	export let iconPosition: 'right' | 'left' = 'right';
	export let disabled = false;
	export let type: 'submit' | 'button' | 'reset' | null | undefined = 'submit';
	export let formaction: string | undefined = undefined;
</script>

<button
	{formaction}
	on:click
	class={`${
		disabled || loading ? 'cursor-not-allowed' : ''
	} bg-black/30  p-2 py-1 xl:px-2 xl:py-1 rounded-md border-[1px] border-accent-muted flex gap-1 items-center ${
		loading
			? 'hover:cursor-not-allowed hover:bg-white/10'
			: 'shadow-lg hover:shadow-main/25 hover:bg-gradient-primary '
	}`}
	{type}
	data-umami-event={event}
	disabled={disabled || loading}
>
	{#if iconPosition === 'right'}
		{text}
	{/if}
	{#if loading}
		<div class="w-2 h-2 rounded-full bg-main animate-pulse"/>
	{:else}
		<Fa class="ml-1" size="xs" {icon} />
	{/if}
	{#if iconPosition === 'left'}
		{text}
	{/if}
</button>
