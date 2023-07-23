<script lang="ts">
	import Highlight from 'svelte-highlight';
	import { markdown } from 'svelte-highlight/languages';
	import github from 'svelte-highlight/styles/github-dark';
	import GlossyCard from '$lib/components/GlossyCard.svelte';
	import BigGridContainer from '$lib/components/BigGridContainer.svelte';
	import NeovimConfigCard from '$lib/components/NeovimConfigCard.svelte';

	import type { PageData } from './$types';

	export let data: PageData;

  const url = `https://dotfyle.com/{username}/{slug}/readme`

  const profileUrl = `https://dotfyle.com/{username}`

	const readmeStructure = `# Title
- plugin count badge
- leaderkey badge
- plugin manager badge

## Install instructions

## Plugins

## Language Servers`;
</script>

<svelte:head>
	{@html github}
</svelte:head>

<div class="flex flex-col px-4 gap-4">
	<div class="w-full justify-center text-left">
		<h1 class="w-full text-left">Generate a README for your Neovim config</h1>
		<p>
			Showcase your leaderkey, plugin manager, plugins and language servers from your Neovim config
			on your GitHub readme.
		</p>
	</div>
	<GlossyCard>
		<section class="flex flex-col gap-2 p-4 w-full">
			<h3>How it works</h3>
			<span class="inline whitespace-normal"
				>Dotfyle generates custom markdown based on metadata from your Neovim config.</span
			>
			<Highlight language={markdown} code={readmeStructure} />
			<span class="inline whitespace-normal"
				>You can change the markdown to your needs before saving it to GitHub.</span
			>
		</section>
	</GlossyCard>
	<GlossyCard>
		<section class="flex flex-col gap-2 p-4 w-full">
			<h3>How to add your README</h3>
			<span class="inline whitespace-normal">
				Navigate to your Neovim config readme on Dotfyle at <code class="bg-black px-1 py-0.5 rounded">{url}</code> and copy the markdown.
			</span>
			<span class="inline whitespace-normal">
				If you don't know the url of your Neovim config on Dotfyle. Navigate to your profile page at <code class="bg-black px-1 py-0.5 rounded">{profileUrl}</code> and manually navigate to your config page. The username is the same as your GitHub username.
			</span>
		</section>
	</GlossyCard>

	<section class="flex flex-col gap-4">
		<GlossyCard>
			<div class="flex flex-col gap-2 p-4">
				<h3>Configs with Dotfyle generated README</h3>

				<span class="whitespace-normal">
          These neovim configs added the Dotfyle generated README to their GitHub. The list updates once a day.
        </span>
			</div>
		</GlossyCard>
		{#await data.loading.configs then configs}
			<BigGridContainer>
				{#each configs as config, _}
				<NeovimConfigCard
					slug={config.slug}
					repo={config.repo}
					owner={config.owner}
					avatar={config.ownerAvatar}
					initFile={config.initFile}
					root={config.root}
					stars={config.stars.toString()}
					pluginManager={config.pluginManager ?? 'unknown'}
					pluginCount={config.pluginCount.toString()}
					showGithubLink={false}
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
</style>
