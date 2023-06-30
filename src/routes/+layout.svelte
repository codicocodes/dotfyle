<script lang="ts">
	import 'nprogress/nprogress.css';
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/stores';
	import CoolText from '$lib/components/CoolText.svelte';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import GithubLoginButton from '$lib/components/GithubLoginButton.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import OuterLayout from '$lib/components/OuterLayout.svelte';
	import { isAdmin } from '$lib/utils';
	import { faDiscord, faGithub, faTwitch } from '@fortawesome/free-brands-svg-icons';
	import { faBars, faKeyboard, faSignOut, faSync, faUser } from '@fortawesome/free-solid-svg-icons';
	import { Avatar } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { DoubleBounce } from 'svelte-loading-spinners';
	import '../app.css';
	import type { LayoutData } from './$types';
	import nProgress from 'nprogress';
	import { onMount } from 'svelte';
	import Modal from '$lib/components/Modal.svelte';
	export let data: LayoutData;
	$: ({ user } = data);

	const logout = async () => {
		close();
		await fetch('/api/auth', { method: 'DELETE' });
		await invalidate(() => true);
	};

	let isOpen = false;

	function close() {
		isOpen = false;
	}

	function toggle() {
		isOpen = !isOpen;
	}

	let syncing = false;
	async function syncPlugins() {
		syncing = true;
		await fetch('/api/seeder/plugins');
		syncing = false;
		isOpen = false;
	}

	nProgress.configure({
		minimum: 0.16,
		showSpinner: false
	});

	$: {
		if ($navigating) {
			nProgress.start();
		} else nProgress.done();
	}
	onMount(() => {
		fetch('/api/auth/refresh', { method: 'POST' }).then((r) => {
			console.log(r.status);
		});
	});

	let showNavModal = false;
</script>

<Modal showModal={showNavModal} onClose={() => (showNavModal = false)}>
	<div class="my-4 flex flex-col gap-2">
		<a
			href="/"
			class="bg-white/30 text-sm font-semibold p-4 py-2 xl:px-6 xl:py-2 rounded-full flex gap-4 items-center hover:bg-gradient-to-br hover:from-cyan-500 hover:to-green-500 shadow-xl hover:shadow-green-300/25 justify-center"
		>
			Home
		</a>
		<a
			href="/configs"
			class="bg-white/30 text-sm font-semibold p-4 py-2 xl:px-6 xl:py-2 rounded-full flex gap-4 items-center hover:bg-gradient-to-br hover:from-cyan-500 hover:to-green-500 shadow-xl hover:shadow-green-300/25 justify-center"
		>
			Configs
		</a>
		<a
			href="/plugins"
			class="bg-white/30 text-sm font-semibold p-4 py-2 xl:px-6 xl:py-2 rounded-full flex gap-4 items-center hover:bg-gradient-to-br hover:from-cyan-500 hover:to-green-500 shadow-xl hover:shadow-green-300/25 justify-center"
		>
			Plugins
		</a>

		<a
			href="/this-week-in-neovim"
			class="bg-white/30 text-sm font-semibold p-4 py-2 xl:px-6 xl:py-2 rounded-full flex gap-4 items-center hover:bg-gradient-to-br hover:from-cyan-500 hover:to-green-500 shadow-xl hover:shadow-green-300/25 justify-center"
		>
			News
		</a>
		<GithubLoginButton />
	</div>
</Modal>

<svelte:head>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Dotfyle" />
	<meta property="og:description" content="Discover and share neovim configs and plugins" />
	<meta property="og:url" content="https://dotfyle.com" />
	<meta property="og:image" content="/dotfyle.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@codicocodes" />
	<meta name="twitter:creator" content="@codicocodes" />
	<meta name="twitter:title" content="Dotfyle" />
	<meta name="twitter:description" content="Discover and share neovim configs and plugins" />
	<meta name="twitter:image" content="/dotfyle.png" />
</svelte:head>

{#if isOpen}
	<div on:keypress={close} on:click={close} class="absolute h-full w-full bg-white-25 z-10" />
{/if}
<div>
	<div class="flex items-center justify-between w-full px-8 gap-4 mt-2">
		<div class="flex items-center w-full">
			<div class="flex w-full gap-12 grow">
				<a href="/" class="text-2xl tracking-tight font-black">
					<CoolText text="dotfyle" />
				</a>
				<div class="hidden sm:flex items-center gap-2 sm:gap-4 text-lg tracking-tight font-semibold">
					<a href="/plugins">
						<CoolTextOnHover>plugins</CoolTextOnHover>
					</a>

					<a href="/configs">
						<CoolTextOnHover>configs</CoolTextOnHover>
					</a>

					<a href="/this-week-in-neovim">
						<CoolTextOnHover>news</CoolTextOnHover>
					</a>
				</div>
			</div>
		</div>
		<div class="flex gap-4 text-sm font-semibold items-center">
			<button on:click={() => (showNavModal = true)}>
				<Fa size="xl" class="block: sm:hidden h-full" icon={faBars} />
			</button>
			{#if user}
				<button on:click={toggle}>
					<div class="flex items-center gap-2 text-lg">
						<span class="hidden sm:inline">
							{user.username}
						</span>
						<Avatar src={user.avatarUrl} width="w-10" />
					</div>
				</button>
			{:else}
				<div class="hidden sm:flex">
					<GithubLoginButton />
				</div>
			{/if}
		</div>
	</div>

	{#if isOpen}
		<div class="absolute right-0 w-40 mt-2 mr-6 z-50">
			<GlossyCard>
				<div class="flex flex-col w-full h-full bg-gray-900 sm:bg-transparent">
					{#if isAdmin(user)}
						<CoolTextOnHover>
							<button class="px-4 py-2 flex gap-2 items-center" on:click={syncPlugins}>
								<div class="force-white-text">
									{#if syncing}
										<DoubleBounce color="#15be97" size="8" />
									{:else}
										<Fa icon={faSync} />
									{/if}
								</div>
								Sync plugins
							</button>
						</CoolTextOnHover>
					{/if}
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
	<OuterLayout>
		<slot />
	</OuterLayout>

	<footer class="sticky mx-auto max-w-full xl:max-w-7xl w-full sm:mt-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-center">
			<div class="flex gap-4 text-gray-400 items-center">
				<a
					href="https://github.com/codicocodes/dotfyle"
					class="flex items-center hover:text-white"
					target="blank"
				>
					<Fa icon={faGithub} />
					<span class="ml-1">star</span>
				</a>

				<a
					href="https://discord.gg/AMbnnN5eep"
					class="flex items-center hover:text-blue-300"
					target="blank"
				>
					<Fa icon={faDiscord} />
					<span class="ml-1">join</span>
				</a>
				<a
					href="https://twitch.tv/codico"
					class="flex items-center hover:text-purple-400"
					target="blank"
				>
					<Fa icon={faTwitch} />
					<span class="ml-1">live</span>
				</a>

				<a
					href="https://speedtyper.dev"
					class="flex items-center hover:text-green-400"
					target="blank"
				>
					<Fa icon={faKeyboard} />
					<span class="ml-1">type</span>
				</a>
			</div>
		</div>
	</footer>
</div>

<style global>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
	:global(#nprogress .bar) {
		@apply bg-emerald-600;
	}
</style>
