<script lang="ts">
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { DoubleBounce } from 'svelte-loading-spinners';
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
	} bg-white/30  p-2 py-1 xl:px-2 xl:py-1 rounded flex gap-1 items-center ${
		loading
			? 'hover:cursor-not-allowed hover:bg-white/10'
			: 'shadow-lg hover:shadow-primary-300/25 hover:bg-gradient-primary '
	}`}
	{type}
	data-umami-event={event}
	disabled={disabled || loading}
>
	{#if iconPosition === 'right'}
		{text}
	{/if}
	{#if loading}
		<DoubleBounce color="#15be97" size="8" />
	{:else}
		<Fa class="ml-1" size="xs" {icon} />
	{/if}
	{#if iconPosition === 'left'}
		{text}
	{/if}
</button>
