<script lang="ts">
	import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
	import CoolText from "./CoolText.svelte";


	export let text: string;
</script>

<a
	class="font-semibold flex items-center gap-1 text-green-500 hover:cursor-not-allowed hover:underline underline-offset-4 decoration-2"
>
	<CoolText text={text}/>
	<Fa icon={faChevronRight} size="xs" />
</a>
