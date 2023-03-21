<script lang="ts">
	import { invalidate } from '$app/navigation';
	import CoolLink from '$lib/components/CoolLink.svelte';
	import CoolText from '$lib/components/CoolText.svelte';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import GithubLoginButton from '$lib/components/GithubLoginButton.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import OuterLayout from '$lib/components/OuterLayout.svelte';
	import { faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
	import { Avatar } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import '../app.css';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	$: ({ user } = data);

	const logout = async () => {
		close();
		await fetch('/api/auth', { method: 'DELETE' });
    await invalidate(() => true)
	};

	let isOpen = false;

	function close() {
		isOpen = false;
	}

	function toggle() {
		isOpen = !isOpen;
	}
</script>

{#if isOpen}
	<div on:keypress={close} on:click={close} class="absolute h-screen w-screen bg-white-25 z-10" />
{/if}
<div>
	<div class="flex items-center justify-between w-full px-8 gap-4 mt-2">
  <div class="flex items-center gap-4 sm:gap-12">
		<a href="/" class="text-2xl tracking-tight font-black">
			<CoolText text="dotfyle" />
		</a>
    <div class="flex items-center gap-2 sm:gap-4">
		<a href="/plugins" class="text-lg tracking-tight font-black">
			<CoolTextOnHover>
        plugins
			</CoolTextOnHover>
		</a>

		<a href="/configs" class="text-lg tracking-tight font-black">
			<CoolTextOnHover>
        configs
			</CoolTextOnHover>
		</a>
    </div>
  </div>
		<div class="text-sm font-semibold flex items-center">
			{#if user}
				<button on:click={toggle}>
					<div class="flex items-center gap-2 text-lg">
						<span class="hidden sm:inline">
							{user.username}
						</span>
						<Avatar src={user.avatarUrl} width="w-10" />
					</div>
				</button>
				{#if isOpen}
					<div class="absolute right-0 w-40 mt-2 mr-6 z-50">
						<GlossyCard>
							<div class="flex flex-col">
								<CoolTextOnHover>
									<a
										on:click={close}
										href={`/${user.username}`}
										class="px-4 py-2 flex gap-2 items-center"
									>
										<div class="force-white-text">
											<Fa icon={faUser} />
										</div>
										Profile</a
									>
								</CoolTextOnHover>
								<CoolTextOnHover>
									<button class="px-4 py-2 flex gap-2 items-center" on:click={logout}>
										<div class="force-white-text">
											<Fa icon={faSignOut} />
										</div>

										Logout
									</button>
								</CoolTextOnHover>
							</div>
						</GlossyCard>
					</div>
				{/if}
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
