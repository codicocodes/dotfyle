<script lang="ts">
	import AddNewConfig from '$lib/components/add/AddNewConfig.svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
	const { user, repositories } = data;
</script>

<div class="flex flex-col justify-center items-center">
	<h1 out:fade class="my-12 md:my-20 text-2xl font-semibold tracking-tight">Add a new Neovim config</h1>
	<AddNewConfig {user} {repositories} />
</div>
