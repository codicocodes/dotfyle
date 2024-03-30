<script lang="ts">
	import { colorschemes, getColorscheme, setColorscheme } from '$lib/theme';
	import { faCheckCircle, faPalette } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Modal from './Modal.svelte';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
	import { browser } from '$app/environment';
	import CoolText from './CoolText.svelte';

	let isOpen = false;

	$: colorscheme = browser && getColorscheme();

	function close() {
		isOpen = false;
	}
</script>

{#if isOpen}
	<div
		on:keypress={close}
		on:click={close}
		class="absolute h-full w-full bg-black/10 z-10 blur-lg"
	/>
{/if}

<button
	aria-label="Change colorscheme"
	data-umami-event="Change colorscheme - Started"
	type="button"
	on:click={() => {
		isOpen = true;
	}}
>
	<Fa icon={faPalette} size="1.5x" />
</button>

<Modal
	showModal={isOpen}
	onClose={() => {
		isOpen = false;
	}}
>
	<h2 class="text-xl m-4 mb-8">
		<CoolText text="Select a color scheme for your Dotfyle experience" />
	</h2>
	<div class="flex justify-center items-center mb-4 mt-4">
		<ThemeSwitcher />
	</div>
	<div class="my-4 w-full mt-2 z-50 text-lg font-semibold flex flex-col gap-2" id="user-menu">
		{#each colorschemes as theme}
			<button
				class="flex w-full sm:min-w-80 py-2 px-4 items-center justify-center bg-black/30 rounded-lg text-black {theme.bg} border-[2px] border-accent-muted hover:border-accent-bright"
				data-umami-event-theme={theme.name}
				on:click={() => {
					setColorscheme(theme.name);
					isOpen = false;
					colorscheme = theme.name;
				}}
			>
				{#if colorscheme === theme.name}
					<span class="left-8 absolute">
						<Fa icon={faCheckCircle} />
					</span>
				{/if}
				{theme.name}
			</button>
		{/each}
	</div>
</Modal>
