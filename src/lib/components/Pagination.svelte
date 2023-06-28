<script lang="ts">
	import type { Page } from '@sveltejs/kit';
	import { navigate } from '$lib/navigate';
	import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import Button from './Button.svelte';
	export let page: Page;
	export let previous: number | null;
	export let next: number | null;
</script>

<div class="flex gap-2 justify-between text-sm font-medium">
	{#if !previous}
		<div class="" />
	{/if}
	{#if previous}
		<Button
			disabled={!previous}
			on:click={() => navigate(page, 'page', String(previous ?? 1), true)}
			iconPosition="left"
			icon={faArrowLeft}
			text="previous"
			loading={false}
		/>
	{/if}
	{#if !next}
		<div class="" />
	{/if}
	{#if next}
		<Button
			disabled={!next}
			on:click={() => navigate(page, 'page', String(next ?? 1), true)}
			iconPosition="right"
			icon={faArrowRight}
			text="next"
			loading={false}
		/>
	{/if}
</div>
