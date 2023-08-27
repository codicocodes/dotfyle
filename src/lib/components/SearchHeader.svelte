<script lang="ts">
	import { page } from '$app/stores';
	import CoolText from './CoolText.svelte';
	import CoolTextOnHover from './CoolTextOnHover.svelte';
	import CoolTextWithChildren from './CoolTextWithChildren.svelte';
	import MediumHeroTitle from './MediumHeroTitle.svelte';
	import PluginSearchNavigation from './PluginSearchNavigation.svelte';
	import Search from './Search.svelte';
	import ShareContainer from './ShareContainer.svelte';

	export let content: any;
	export let placeholder: string;
	export let navigation: any[];
</script>

<div class="flex flex-col w-full items-center my-8 gap-4">
	<meta class="" itemprop="dateUpdated" content={new Date().toLocaleDateString()} />
	<MediumHeroTitle>
		<CoolText text={content.title} />
	</MediumHeroTitle>
	<p class="text-lg">
		{content.description}
	</p>
</div>

<div class="flex w-full justify-center">
	<ShareContainer
		url={$page.url.origin + $page.url.pathname}
		tweetText={content.title}
		emailSubject={content.title}
		emailBody={content.description}
	/>
</div>

<Search {placeholder} />
<div class="flex flex-col w-full items-center mt-4 gap-4">
	<div class="flex gap-6 font-medium text-lg">
		{#each navigation as nav}
			{#if $page.params.sort === nav.value}
				<a href={nav.path}>
					<button>
						<CoolTextWithChildren>{nav.label}</CoolTextWithChildren>
					</button>
				</a>
			{:else}
				<a href={nav.path}>
					<button>
						<CoolTextOnHover>{nav.label}</CoolTextOnHover>
					</button>
				</a>
			{/if}
		{/each}
	</div>
	<div class="w-full bg-white h-[0.05rem]" />
</div>
