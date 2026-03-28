<script lang="ts">
	import type { Media } from '@prisma/client';
	import { getMediaType } from '$lib/utils';
	interface Props {
		avatar?: string | null;
		name: string;
		link: string;
		description: string;
		thumbnail?: Media | null;
		disableMinHeight?: boolean;
		footer?: import('svelte').Snippet;
	}

	let {
		avatar = null,
		name,
		link,
		description,
		thumbnail = null,
		disableMinHeight = false,
		footer
	}: Props = $props();
</script>

<div
	class="{!link
		? 'pointer-events-none'
		: ''} h-full flex flex-col justify-between rounded-lg bg-black/30 transition-all shadow-lg p-2 px-5 border-[0.5px] border-accent-muted hover:border-accent-bright"
>
	<div class="flex flex-col gap-1 text-sm">
		<a
			href={link}
			class="h-full flex space-x-4 transition-colors items-start {disableMinHeight
				? ''
				: 'min-h-[8rem]'}"
		>
			<!-- min-h-[8rem] corresponds to h-32 -->
			<div class="w-full h-full flex flex-col gap-4">
				<div class="flex flex-col gap-1 h-full">
					<div class="flex w-full gap-1 items-center">
						{#if avatar}
							<img alt="" class="w-6 h-6 rounded-full" src={avatar} />
						{/if}
						<span class="text-sm font-semibold tracking-wide md:text-base whitespace-normal">
							{name}
						</span>
					</div>
					<span class="text-xs tracking-wide md:text-sm whitespace-normal">
						{description}
					</span>
				</div>
			</div>
			{#if thumbnail}
				<div class="h-22 w-72 rounded flex items-center">
					{#if getMediaType(thumbnail) === 'image'}
						<img
							class="h-full w-full object-cover rounded-lg text-xs max-h-[7rem]"
							onerror={() => console.log('failed loading thumbnail')}
							style="object-position: center;"
							src={thumbnail.url}
							alt="{name} thumbnail"
						/>
					{/if}
					{#if getMediaType(thumbnail) === 'video'}
						<video
							class="h-full w-full object-cover rounded-lg text-xs max-h-[7rem]"
							onerror={() => console.log('failed loading thumbnail')}
							style="object-position: center;"
							src={thumbnail.url}
							autoplay
							playsinline
							muted
						></video>
					{/if}
				</div>
			{/if}
		</a>
		{@render footer?.()}
	</div>
</div>
