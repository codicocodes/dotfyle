<script lang="ts">
	import AddNewConfig from '$lib/components/add/AddNewConfig.svelte';
	import { page } from '$app/stores';
	import type { GithubRepository } from '$lib/server/github/schema';
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';
	import HeroTitle from '$lib/components/HeroTitle.svelte';
	import CoolText from '$lib/components/CoolText.svelte';
	import session from '$lib/stores/session';

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
	<title>Welcome to Dotfyle</title>
</svelte:head>

<div class="flex flex-col justify-center items-center">
	<HeroTitle>
		Welcome to <CoolText text="Dotfyle" />
	</HeroTitle>
	{#if loading || $session.loading}
		<div class="flex flex-col gap-2 items-center">
			<div class="w-2 h-2 rounded-full bg-main animate-pulse"/>
			<h2 class="text-xl font-light tracking-wide">loading github repositories</h2>
		</div>
	{:else if error || !$session.user}
		{error}
	{:else}
		<AddNewConfig user={$session.user} {repositories} />
	{/if}
</div>
