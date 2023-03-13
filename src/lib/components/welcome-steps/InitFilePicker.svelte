<script lang="ts">
	import type { InitFile } from '$lib/nvim-sync/services/init-file-finder';
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';
	import { DoubleBounce } from 'svelte-loading-spinners';
	import { slide } from 'svelte/transition';
	import GridContainer from '../GridContainer.svelte';
	import RepoPickerItem from '../RepoPickerItem.svelte';
	let error: string | undefined;
	let loading = true;
	let files: InitFile[] | undefined;
	export let selectedFile: InitFile | undefined;
  export let handleSelectInitFile: (f: InitFile) => void

	onMount(async () => {
		await new Promise<void>((r) => setTimeout(() => r(), 4000));
		await trpc()
			.findRepoInitFiles.query({ repo: 'dotfiles' })
			.then((f) => {
				files = f;
			})
			.catch((e) => {
				error = e.message;
			});
		loading = false;
	});
</script>

{#if loading}
	<div class="flex w-full items-center justify-center gap-2 my-4">
		<DoubleBounce color="#15be97" size="28" />
		<h2 class="text-xl font-medium">Loading init files...</h2>
	</div>
{/if}

{#if error}
	<div class="flex w-full items-center justify-center gap-2 my-4">
		<h2 class="text-xl font-medium">{error}</h2>
	</div>
{/if}

{#if files && files.length > 0}
	<div class="my-4">
		<GridContainer>
			{#each files as file, i}
				<button
					on:click={() => handleSelectInitFile(file)}
					on:keypress={() => handleSelectInitFile(file)}
					in:slide
				>
					<RepoPickerItem name={file.path} selected={selectedFile?.path === file.path} />
				</button>
			{/each}
		</GridContainer>
	</div>
{:else if files}
	<div class="flex w-full items-center justify-center gap-2 my-4">
		<h2 class="text-xl font-medium">no init files detected</h2>
	</div>
{/if}
