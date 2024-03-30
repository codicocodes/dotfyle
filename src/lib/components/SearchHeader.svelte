<script lang="ts">
	import { page } from '$app/stores';
	import CoolText from './CoolText.svelte';
	import CoolTextOnHover from './CoolTextOnHover.svelte';
	import CoolTextWithChildren from './CoolTextWithChildren.svelte';
	import MediumHeroTitle from './MediumHeroTitle.svelte';
	import Search from './Search.svelte';
	import TwinLink from './TwinLink.svelte';
	interface Post {
		title: string;
		description: string;
	}

	export let content: Post;
	export let placeholder: string;
	export let navigation: any[];
</script>

<div class="flex flex-col w-full items-center gap-4">
	<meta class="" itemprop="dateUpdated" content={new Date().toLocaleDateString()} />
	<MediumHeroTitle>
		<CoolText text={content.title} />
	</MediumHeroTitle>
	<p class="text-lg text-center w-full sm:w-3/4 md:w-2/3 xl:w-1/2 min-h-24">
		{content.description}
	</p>
</div>
<div class="flex flex-col gap-4 my-4">
	<Search {placeholder} />
	<TwinLink />
</div>
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
