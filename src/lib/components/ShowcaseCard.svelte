<script lang="ts">
  import type { Media } from '@prisma/client';
  import { getMediaType } from '$lib/utils';
  interface Props {
    name: string;
    link: string;
    description: string;
    thumbnail: Media;
    footer?: import('svelte').Snippet;
  }

  let { name, link, description, thumbnail, footer }: Props = $props();
</script>

<a
  href={link}
  class="h-full flex flex-col justify-between rounded-md p-2 border-[0.5px] border-transparent hover:border-accent-bright gap-4"
>
  <div class="sm:h-52 md:h-60 lg:h-72 xl:h-96 w-full rounded flex items-center">
    {#if getMediaType(thumbnail) === 'image'}
      <img
        class="h-full w-full object-cover rounded-lg text-xs"
        onerror={() => console.log('failed loading thumbnail')}
        style="object-position: center;"
        src={thumbnail.url}
        alt="{name} thumbnail"
      />
    {/if}
    {#if getMediaType(thumbnail) === 'video'}
      <video
        class="h-full w-full object-cover rounded-lg text-xs"
        onerror={() => console.log('failed loading thumbnail')}
        style="object-position: center;"
        src={thumbnail.url}
        autoplay
        muted
        playsinline
      ></video>
    {/if}
  </div>
  <div class="flex flex-col gap-1">
    <div class="h-full flex space-x-4 transition-colors items-start">
      <div class="w-full h-full flex flex-col gap-4">
        <div class="flex flex-col gap-1 h-full">
          <div class="flex w-full gap-2 items-center">
            <span class="text-xl font-semibold tracking-wide whitespace-normal">
              {name}
            </span>
          </div>
          <span class="text-base font-medium tracking-wide whitespace-normal">
            {description}
          </span>
        </div>
      </div>
    </div>
    {@render footer?.()}
  </div>
</a>
