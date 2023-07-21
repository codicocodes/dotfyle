<script lang="ts">
	import BigGridContainer from '$lib/components/BigGridContainer.svelte';
	import NeovimPluginCard from '$lib/components/NeovimPluginCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col px-4">
	<div class="w-full justify-center text-left">
		<h1 class="w-full text-left">Adding a plugin usage badge to your readme</h1>
		<p>
			Showcase your plugins usage in Neovim configs on Dotfyle by adding a badge to your your GitHub
			readme. Help users find other Neovim configs using your plugin.
		</p>
	</div>

	<div class="">
		<a href="/plugins/nvim-treesitter/nvim-treesitter">
			<img src="/plugins/nvim-treesitter/nvim-treesitter/shield" />
		</a>
	</div>
	<section class="flex flex-col gap-2">
		<h3>How to add your badge</h3>
		<span>
			Add the following HTML to your plugins readme but replace <code
				class="w-auto rounded px-1 py-0.5 bg-gray-400 border border-gray-700"
				>{'{owner}'}
			</code>
			and
			<code class="w-auto rounded px-1 py-0.5 bg-gray-400 border border-gray-700">{'{name}'} </code>
			with your GitHub username and repository name.
		</span>
		<pre>
    <code class="text-gray-200">
{`<a href="https://dotfyle.com/plugins/{owner}/{name}">
  <img src="https://dotfyle.com/plugins/{owner}/{name}/shield" />
</a>`}</code
			>

    </pre>
	</section>
	<section class="flex flex-col gap-2">
		<h3>Query parameters</h3>

		<div>
			<code class="w-auto rounded px-1 py-0.5 bg-gray-400 border border-gray-700">style</code>
			<i>string</i>
		</div>

		<span>One of: flat (default), flat-square, plastic, for-the-badge, social </span>

		<span>The example uses: flat</span>
	</section>

	<section class="flex flex-col gap-2">
		<h3>Plugins with the badge</h3>

		<span>These plugins added the Dotfyle usage badge to their GitHub Readme. Add the badge to your plugins readme to get on the list. The list updates once a day.</span>
		{#await data.loading.plugins then plugins}
			<BigGridContainer>
				{#each plugins as plugin, _}
					<NeovimPluginCard
						owner={plugin.owner}
						name={plugin.name}
						stars={plugin.stars.toString()}
						configCount={plugin.configCount}
						category={plugin.category}
						shortDescription={plugin.shortDescription}
					/>
				{/each}
			</BigGridContainer>
		{/await}
	</section>
</div>

<style lang="postcss">
	h1 {
		@apply text-2xl sm:text-3xl font-semibold tracking-wider my-4;
	}
	h3 {
		@apply text-lg sm:text-xl font-semibold tracking-wider my-2;
	}
	p {
		@apply text-sm sm:text-lg my-2 gap-2 break-words;
	}
	pre {
		@apply bg-black px-4 rounded-lg overflow-x-scroll text-sm sm:text-lg;
	}
</style>
