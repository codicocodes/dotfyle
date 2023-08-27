<script lang="ts">
	import { page } from '$app/stores';
	const links = [
		{ label: 'Discover', url: '/neovim/plugins/trending' },
		{ label: 'Colorschemes', url: '/neovim/colorscheme/trending' },
		{ label: 'Configurations', url: '/neovim/configurations/top' }
	];

	function isOnCurrentUrl(relativeUrl: string) {
		const paths = relativeUrl.split('/');
		paths.pop();
		const pathWithoutSort = paths.join('/');
		return $page.url.pathname.startsWith(pathWithoutSort);
	}
</script>

<div class="w-full flex gap-2 mt-2 text-sm">
	{#each links as link}
		<a
			data-sveltekit-reload
			href={link.url}
			class="{isOnCurrentUrl(link.url)
				? 'bg-white text-black'
				: 'bg-white/10 hover:bg-white text-white hover:text-black'} p-2 rounded-full font-semibold"
		>
			{link.label}
		</a>
	{/each}
</div>
