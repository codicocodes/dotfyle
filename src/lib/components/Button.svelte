<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	interface Props {
		text: string;
		icon: IconDefinition;
		event?: string | undefined;
		loading?: boolean;
		iconPosition?: 'right' | 'left';
		disabled?: boolean;
		type?: 'submit' | 'button' | 'reset' | null | undefined;
		formaction?: string | undefined;
	}

	let {
		text,
		icon,
		event = undefined,
		loading = false,
		iconPosition = 'right',
		disabled = false,
		type = 'submit',
		formaction = undefined
	}: Props = $props();
</script>

<button
	{formaction}
	onclick={bubble('click')}
	class={`${
		disabled || loading ? 'cursor-not-allowed' : ''
	} border-[1px] transition-all border-accent-muted bg-black/30  p-2 py-1 xl:px-4 xl:py-1 rounded-lg border-[1px] border-accent-muted flex gap-1 items-center ${
		loading ? 'hover:cursor-not-allowed hover:bg-white/10' : 'hover:border-secondary'
	}`}
	{type}
	data-umami-event={event}
	disabled={disabled || loading}
>
	{#if iconPosition === 'right'}
		{text}
	{/if}
	{#if loading}
		<div class="w-2 h-2 rounded-full bg-main animate-pulse"></div>
	{:else}
		<Fa class="ml-1" size="xs" {icon} />
	{/if}
	{#if iconPosition === 'left'}
		{text}
	{/if}
</button>
