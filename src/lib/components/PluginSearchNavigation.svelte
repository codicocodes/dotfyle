<script lang="ts">
	import { page } from '$app/stores';
	$page.url;
	const links = [
		{ label: 'Discover', url: '/neovim/plugins/trending' },
		{ label: 'Colorschemes', url: '/neovim/colorscheme/trending' },
		{ label: 'Configurations', url: '/neovim/configurations/top' },
	];
</script>

<div class="w-full flex gap-2 mt-2 text-sm">
	{#each links as link}
		<a href={link.url} class="{$page.url.pathname.includes(link.url.split("/")[2]) ? "bg-white text-black" : "bg-white/10 hover:bg-white text-white hover:text-black"} p-2 rounded-full font-semibold"> {link.label} </a>
	{/each}
</div>
