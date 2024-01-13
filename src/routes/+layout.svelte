<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import 'nprogress/nprogress.css';
	import '@fontsource-variable/inter';
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/stores';
	import CoolText from '$lib/components/CoolText.svelte';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import GithubLoginButton from '$lib/components/GithubLoginButton.svelte';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import OuterLayout from '$lib/components/OuterLayout.svelte';
	import { isAdmin } from '$lib/utils';
	import { faDiscord, faGithub, faTwitch } from '@fortawesome/free-brands-svg-icons';
	import {
		faBars,
		faKeyboard,
		faNewspaper,
		faPlus,
		faRss,
		faSignOut,
		faSync,
		faTerminal,
		faUser
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { DoubleBounce } from 'svelte-loading-spinners';
	import '../app.css';
	import type { LayoutData } from './$types';
	import nProgress from 'nprogress';
	import { onMount } from 'svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { getLatestReadTwinPost, updateLatestReadTwinPost } from '$lib/services/twin';
	import CoolTextWithChildren from '$lib/components/CoolTextWithChildren.svelte';
	import { getTheme, setTheme } from '$lib/theme';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	export let data: LayoutData;
	$: ({ user } = data);

	const logout = async () => {
		close();
		await fetch('/api/auth', { method: 'DELETE' });
		await invalidate(() => true);
		user = null
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
		fetch('/api/auth/refresh', { method: 'POST' });
	});

	let showNavModal = false;

	let showTwinPost = false;

	$: {
		if (browser && data.latestTwinPost) {
			const url = `/this-week-in-neovim/${data.latestTwinPost.issue}`;
			const notOnCurrentTwinIssue = !window.location.toString().includes(url);
			const read = getLatestReadTwinPost();
			showTwinPost = notOnCurrentTwinIssue && (!read || read < data.latestTwinPost.issue);
		}
	}

	function setReadTwinPost() {
		if (data.latestTwinPost) {
			updateLatestReadTwinPost(data.latestTwinPost.issue);
			showTwinPost = false;
		}
	}

	$: if (browser) setTheme(getTheme()); // If light theme add light class to <html>
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
	<script
		async
		src="https://umami-production-7f33.up.railway.app/script.js"
		data-website-id="e1c8c45f-d36f-4793-9d07-fb8bdcf458b3"
	></script>
</svelte:head>

<SvelteToast />

<Modal showModal={showNavModal} onClose={() => (showNavModal = false)}>
	<nav class="my-4 flex flex-col gap-2">
		<a
			href="/"
			class="bg-white/30 text-sm font-semibold p-4 py-2 xl:px-6 xl:py-2 rounded-full flex gap-4 items-center hover:bg-gradient-primary shadow-xl hover:shadow-main/25 justify-center"
		>
			Home
		</a>
		<a
			href="/neovim/plugins/trending"
			class="bg-white/30 text-sm font-semibold p-4 py-2 xl:px-6 xl:py-2 rounded-full flex gap-4 items-center hover:bg-gradient-primary shadow-xl hover:shadow-main/25 justify-center"
		>
			Plugins
		</a>
		<a
			href="/neovim/configurations/top"
			class="bg-white/30 text-sm font-semibold p-4 py-2 xl:px-6 xl:py-2 rounded-full flex gap-4 items-center hover:bg-gradient-primary shadow-xl hover:shadow-main/25 justify-center"
		>
			Configurations
		</a>
		<a
			href="/this-week-in-neovim"
			class="bg-white/30 text-sm font-semibold p-4 py-2 xl:px-6 xl:py-2 rounded-full flex gap-4 items-center hover:bg-gradient-primary shadow-xl hover:shadow-main/25 justify-center"
		>
			News
		</a>
		<GithubLoginButton />
	</nav>
</Modal>

{#if isOpen}
	<div on:keypress={close} on:click={close} class="absolute h-full w-full bg-white-25 z-10" />
{/if}
<div>
	{#if showTwinPost && data.latestTwinPost}
		<div
			in:fly
			on:mousedown={(e) => {
				if (e.button === 1) {
					setReadTwinPost();
				}
			}}
			on:keydown={setReadTwinPost}
			on:click={setReadTwinPost}
		>
			<CoolTextWithChildren>
				<a
					href="/this-week-in-neovim/{data.latestTwinPost.issue}"
					class="flex flex-row items-center justify-center bg-black/30 transition-colors shadow-lg p-2 px-5 border-base-500 hover:border-base-200 font-semibold mb-4 text-sm"
				>
					<span>
						<Fa icon={faNewspaper} class="force-white-text inline mr-1" />
						{data.latestTwinPost?.title}
					</span>
				</a>
			</CoolTextWithChildren>
		</div>
	{/if}
	<header class="flex items-center justify-between px-8 gap-4 mt-2">
		<div class="flex items-center">
			<div class="flex gap-12">
				<a href="/" class="flex items-center gap-2 text-2xl tracking-tight font-black">
					<Fa icon={faTerminal} size="xs" class="text-sm text-cyan-500 bg-transparent" />
					<CoolText text="dotfyle" />
				</a>
				<div class="hidden sm:flex items-center gap-2 sm:gap-4 text-lg tracking-tight font-medium">
					<a href="/neovim/plugins/trending">
						<CoolTextOnHover>Plugins</CoolTextOnHover>
					</a>

					<a href="/neovim/configurations/top">
						<CoolTextOnHover>Configurations</CoolTextOnHover>
					</a>

					<a href="/this-week-in-neovim">
						<CoolTextOnHover>News</CoolTextOnHover>
					</a>
				</div>
			</div>
		</div>
		<div class="flex gap-4 text-sm font-semibold items-center">
			<ThemeSwitcher />
			<button on:click={() => (showNavModal = true)} aria-label="Toggle navigation menu">
				<Fa size="xl" class="block: sm:hidden h-full" icon={faBars} />
			</button>
			{#if user}
				<a
					href="/neovim/plugins/add"
					class="border-[0.5px] border-base-400 bg-white/20 p-2 rounded"
					title="add plugin"
					data-umami-event="Add Plugin - Started"
				>
					<Fa icon={faPlus} size="xs" />
				</a>
				<button
					on:click={toggle}
					type="button"
					aria-expanded={isOpen}
					aria-controls={isOpen ? 'user-menu' : undefined}
				>
					<div class="flex items-center gap-2 text-lg">
						<span class="hidden sm:inline">
							{user.username}
						</span>
						<img
							alt="User's avatar"
							height="10"
							width="10"
							src={user.avatarUrl}
							class="w-10 h-10 rounded-full"
						/>
					</div>
				</button>
			{:else}
				<div class="hidden sm:flex">
					<GithubLoginButton />
				</div>
			{/if}
		</div>
	</header>

	{#if isOpen}
		<div class="absolute right-0 w-40 mt-2 mr-6 z-50" id="user-menu">
			<GlossyCard>
				<div class="flex flex-col w-full h-full bg-base-900 sm:bg-transparent">
					{#if isAdmin(user)}
						<CoolTextOnHover>
							<button class="px-4 py-2 flex gap-2 items-center" on:click={syncPlugins}>
								<div class="force-white-text">
									{#if syncing}
										<DoubleBounce color="#15be97" size="8" />
									{:else}
										<Fa icon={faSync} class="text-base-100" />
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
								<Fa icon={faUser} class="text-base-100" />
							</div>
							Profile</a
						>
					</CoolTextOnHover>
					<CoolTextOnHover>
						<button class="px-4 py-2 flex gap-2 items-center" on:click={logout}>
							<div class="force-white-text">
								<Fa icon={faSignOut} class="text-base-100" />
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

		<footer class="flex flex-col max-w-full xl:max-w-7xl w-full sm:mt-4 px-4 sm:px-4 gap-4 mt-8">
			<div class="sticky mx-auto grid sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
				<div class="flex flex-col gap-2 text-base-400 items-start">
					<h3 class="text-2xl font-semibold tracking-wider">Sitemap</h3>
					<a href="/neovim/plugins/trending" class="flex items-center hover:text-white gap-2">
						<span>Trending Neovim Plugins</span>
					</a>
					<a href="/neovim/plugins/top" class="flex items-center hover:text-white gap-2">
						<span>Top Neovim Plugins</span>
					</a>
					<a href="/neovim/plugins/new" class="flex items-center hover:text-white gap-2">
						<span>New Neovim Plugins</span>
					</a>

					<a href="/neovim/colorscheme/trending" class="flex items-center hover:text-white gap-2">
						<span>Trending Neovim Colorschemes</span>
					</a>
					<a href="/neovim/colorscheme/top" class="flex items-center hover:text-white gap-2">
						<span>Top Neovim Colorschemes</span>
					</a>
					<a href="/neovim/colorscheme/new" class="flex items-center hover:text-white gap-2">
						<span>New Neovim Colorschemes</span>
					</a>
					<a href="/neovim/configurations/top" class="flex items-center hover:text-white gap-2">
						<span>Awesome Neovim Configurations</span>
					</a>
					<a href="/this-week-in-neovim" class="flex items-center hover:text-white gap-2">
						<span>This Week in Neovim</span>
					</a>

					<a
						href="https://dotfyle.com/this-week-in-neovim/rss.xml"
						class="flex items-center hover:text-orange-400 gap-2"
					>
						<div class="flex items-start w-4">
							<Fa icon={faRss} />
						</div>
						<span class="ml-1">RSS Feed</span>
					</a>
				</div>
				<div class="flex flex-col gap-2 text-base-400 items-start">
					<h3 class="text-2xl font-semibold tracking-wider">Guides</h3>
					<a href="/guides/auto-generated-readme" class="flex items-center hover:text-white gap-2">
						<span class="">How to automatically create a README for your Neovim config</span>
					</a>
					<a href="/guides/plugin-usage-badge" class="flex items-center hover:text-white gap-2">
						<span class="">Showcase your Neovim plugins usage with a badge</span>
					</a>
				</div>
				<div class="flex flex-col gap-2 text-base-400 items-start">
					<h3 class="text-2xl font-semibold tracking-wider">Dotfyle</h3>
					<a
						href="https://github.com/codicocodes/dotfyle"
						class="flex items-center hover:text-white gap-2"
						target="blank"
					>
						<div class="flex items-start w-6">
							<Fa icon={faGithub} />
						</div>
						<span class="ml-1">GitHub</span>
					</a>

					<a
						href="https://discord.gg/AMbnnN5eep"
						class="flex items-center hover:text-blue-300 gap-2"
						target="blank"
					>
						<div class="flex items-start w-6">
							<Fa icon={faDiscord} />
						</div>
						<span class="ml-1">Discord</span>
					</a>
					<a
						href="https://twitch.tv/codico"
						class="flex items-center hover:text-purple-400 gap-2"
						target="blank"
					>
						<div class="flex items-start w-6">
							<Fa icon={faTwitch} />
						</div>
						<span class="ml-1">Twitch</span>
					</a>

					<a
						href="https://speedtyper.dev"
						class="flex items-center hover:text-shit gap-2"
						target="blank"
					>
						<div class="flex items-start w-6">
							<Fa icon={faKeyboard} />
						</div>
						<span class="ml-1">Speedtyper.dev</span>
					</a>
				</div>
			</div>
		</footer>
	</OuterLayout>
</div>
