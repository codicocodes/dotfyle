<script lang="ts">
	import type { InitFile } from '$lib/server/nvim-sync/config/InitFileFinder';
	import { unsyncedConfig, type UnsyncedConfig } from '$lib/stores/unsyncedConfigStore';
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';
	import { DoubleBounce } from 'svelte-loading-spinners';
	import { slide } from 'svelte/transition';
	import GridContainer from '../GridContainer.svelte';
	import RepoPickerItem from '../RepoPickerItem.svelte';
	let error: string | undefined;
	let loading = true;
	let files: InitFile[] | undefined;

	function selectInitFile(f: InitFile) {
		unsyncedConfig.update((c) => ({
			...c,
			root: f.root,
			initFile: f.type
		}));
	}

	function isSelectedFile(f: InitFile, u: UnsyncedConfig): boolean {
    const selectedSlug = (u?.root ?? '') + (u?.initFile ?? '');
		const currentFileSlug = f.root + f.type;
		return selectedSlug === currentFileSlug;
	}

	onMount(async () => {
		if (!$unsyncedConfig.repo || !$unsyncedConfig.branch) return;
		await trpc()
			.findRepoInitFiles.query({ repo: $unsyncedConfig.repo, branch: $unsyncedConfig.branch })
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
					on:click={() => selectInitFile(file)}
					on:keypress={() => selectInitFile(file)}
					in:slide
				>
					<RepoPickerItem name={file.path} selected={isSelectedFile(file, $unsyncedConfig)} />
				</button>
			{/each}
		</GridContainer>
	</div>
{:else if files}
	<div class="flex w-full items-center justify-center gap-2 my-4">
		<h2 class="text-xl font-medium">no init files detected</h2>
	</div>
{/if}
