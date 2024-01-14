<script lang="ts">
	import AddNewConfig from '$lib/components/add/AddNewConfig.svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import type { GithubRepository } from '$lib/server/github/schema';
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';

	export let data: PageData;
	const { user } = data;

	let repositories: GithubRepository[] = [];
	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			const fetchedRepos = await trpc($page).getRepositories.query();
			repositories = fetchedRepos;
		} catch (e) {
			error = 'could not load github repositories';
		}
		loading = false;
	});
</script>

<svelte:head>
	<title>
		Add neovim config
	</title>
</svelte:head>

<div class="flex flex-col justify-center items-center">
	<h1 out:fade class="my-12 md:my-20 text-2xl font-semibold tracking-tight">
		Add a new Neovim config
	</h1>
	{#if loading}
		<div class="w-2 h-2 rounded-full bg-main animate-pulse"/>
	{:else if error}
		{error}
	{:else}
		<AddNewConfig {user} {repositories} />
	{/if}
</div>
