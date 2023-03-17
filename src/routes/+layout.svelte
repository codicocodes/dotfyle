<script lang="ts">
	import CoolText from '$lib/components/CoolText.svelte';
	import GithubLoginButton from '$lib/components/GithubLoginButton.svelte';
	import OuterLayout from '$lib/components/OuterLayout.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import '../app.css';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	const { user } = data;
</script>

<div class="mt-2">
	<div class="flex items-center justify-between w-full px-8 gap-4">
		<a href="/" class="text-2xl tracking-tight font-black">
			<CoolText text="dotfyle" />
		</a>
		<div class="text-sm font-semibold">
			{#if user}
				<div class="flex items-center gap-2 text-lg">
					<span class="hidden sm:inline">
						{user.username}
					</span>
					<Avatar src={user.avatarUrl} width="w-10" />
				</div>
			{:else}
				<GithubLoginButton />
			{/if}
		</div>
	</div>
	<OuterLayout>
		<slot />
	</OuterLayout>
</div>

<style global>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
</style>
