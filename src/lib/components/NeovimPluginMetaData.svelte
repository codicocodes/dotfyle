<script lang="ts">
	import { faHashtag, faStar, faUserGroup } from "@fortawesome/free-solid-svg-icons";


	import Fa from "svelte-fa";
  
  export let stars: string
  export let configCount: number
  export let category: string

</script>
	<div class="m-1 flex font-medium">
		<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
			<Fa icon={faStar} />
			{stars}
		</span>
		<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
			<Fa icon={faUserGroup} />
			{configCount}
		</span>
		<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
			<Fa icon={faHashtag} />
			{category}
		</span>
	</div>
