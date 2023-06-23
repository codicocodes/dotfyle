<script lang="ts">
	import { humanizeAbsolute } from "$lib/utils";
	import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import Fa from "svelte-fa";
	import CoolTextWithChildren from "./CoolTextWithChildren.svelte";
	import CoolTextOnHover from "./CoolTextOnHover.svelte";

	export let title: string;
	export let text: string;
  export let url: string;
  export let date: Date;
</script>

<div
	class="relative flex flex-col justify-between overflow-hidden rounded-md border border-green-300/25 bg-white/10 transition-colors w-full shadow-lg hover:shadow-green-300/25 transition-colors bg-white/10 hover:bg-white/20 "
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
  <div class="text-xs font-thin tracking-wide">
{humanizeAbsolute(date)}
</div>
</div>
	<div class="flex items-center space-x-2 p-2 pl-5 h-full">
		<div class="text-sm font-thin tracking-wide">
		  {text}
		</div>
	</div>
</div>
