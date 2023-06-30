<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import CoolTextOnHover from '$lib/components/CoolTextOnHover.svelte';
	import Fa from 'svelte-fa';
	import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
	import CoolText from '$lib/components/CoolText.svelte';

	export let data: PageData;
</script>

<div class="w-full flex flex-col items-center px-4">
	<div class="flex flex-col max-w-5xl w-full gap-4">
		<p class="flex text-xl font-light my-4">
			This Week In Neovim is a weekly newsletter with updates from the Neovim ecosystem, including
			new plugins and breaking changes.
		</p>

		<p class="text-xl font-light my-4 inline">
			TWiN was created by
			<a href="https://github.com/phaazon" target="_blank">
				<CoolText text="phaazon" />
			</a>
			who has decided to

			<a href="https://dotfyle.com/this-week-in-neovim/46#update-twin" target="_blank">
				<CoolText text="move away from the project" />
			</a>

			💚 Thank you for everything you've done for the community!
		</p>

		<h2 class="font-semibold text-3xl">Past issues</h2>
		<div class="flex flex-col gap-4">
			{#each data.posts as post}
				<CoolTextOnHover>
					<a
						class="flex text-xl font-light justify-between"
						href="/this-week-in-neovim/{post.issue}"
					>
						<span>{new Date(post.createdAt).toLocaleDateString()} </span>
						<span class="flex gap-2 items-center"
							>{post.title}
							<Fa size="xs" class="force-white-text" icon={faChevronCircleRight} />
						</span>
					</a>
				</CoolTextOnHover>
			{/each}
		</div>
		<Pagination page={$page} next={data.pagination.next} previous={data.pagination.prev} />
	</div>
</div>
