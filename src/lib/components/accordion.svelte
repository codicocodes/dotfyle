<script lang="ts">
	import Fa from "svelte-fa";
	import GlossyCard from "./GlossyCard.svelte";
	import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
	import { slide } from "svelte/transition";
  export let open = false;
</script>
<GlossyCard>
	<div class="flex flex-col w-full">
		<button
			on:click={() => (open = !open)}
			class="p-4 text-xl w-full flex justify-between items-center"
		>
			<span class="font-semibold"><slot name="title" /></span>
			<Fa icon={!open ? faChevronDown : faChevronUp} size="sm" />
		</button>
    {#if open}
		<div transition:slide class="w-full">
			<slot name="content" />
		</div>
    {/if}
	</div>
</GlossyCard>
