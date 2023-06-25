<script lang="ts">
	import type { JsonBreakingChangePost } from '$lib/types';
	import { humanizeAbsolute } from '$lib/utils';
	import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import CoolTextOnHover from './CoolTextOnHover.svelte';

	export let post: JsonBreakingChangePost;

	const date = new Date(post.createdAt);
	const url = `/plugins/${post.breakingChange.plugin.owner}/${post.breakingChange.plugin.name}`;
	const title = `Breaking change in ${post.breakingChange.plugin.name}`;
	const text = post.title;
</script>

<div
	class="relative flex flex-col justify-between overflow-hidden rounded-md border border-green-300/25 bg-white/10 transition-colors w-full shadow-lg hover:shadow-green-300/25 hover:bg-white/20"
>
	<div class="flex items-center space-x-2 pt-2 py-1 pl-5">
		<CoolTextOnHover>
			<a class="flex gap-2 items-center" href={url}>
				<div class="text-sm font-semibold tracking-wide">
					{title}
				</div>
				<Fa class="force-white-text" size="sm" icon={faChevronCircleRight} />
			</a>
		</CoolTextOnHover>
	</div>
	<div class="flex items-center space-x-2 pl-5">
		<div class="text-xs font-normal tracking-wide">
			{humanizeAbsolute(date)}
		</div>
	</div>
	<div class="flex items-center space-x-2 p-2 pl-5 h-full">
		<div class="text-sm font-normal tracking-wide">
			{text}
		</div>
	</div>
</div>
