<script lang="ts">
	import AddNewConfig from '$lib/components/add/AddNewConfig.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import type { GithubRepository } from '$lib/server/github/schema';
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';
	import { DoubleBounce } from 'svelte-loading-spinners';
	import HeroTitle from '$lib/components/HeroTitle.svelte';
	import CoolText from '$lib/components/CoolText.svelte';

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

<div class="flex flex-col justify-center items-center">
	<HeroTitle>
		Welcome to <CoolText text="Dotfyle" />
	</HeroTitle>
	{#if loading}
		<div class="flex flex-col gap-2 items-center">
			<DoubleBounce color="#15be97" size="36" />
			<h2 class="text-xl font-light tracking-wide">loading github repositories</h2>
		</div>
	{:else if error}
		{error}
	{:else}
		<AddNewConfig {user} {repositories} />
	{/if}
</div>
