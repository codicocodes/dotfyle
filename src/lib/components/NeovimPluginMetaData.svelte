<script lang="ts">
	import { faStar, faUserGroup } from '@fortawesome/free-solid-svg-icons';

	import Fa from 'svelte-fa';

	export let stars: string;
	export let configCount: number;
	export let category: string;
</script>

<div class="flex gap-4 font-medium">
	<span class="py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
		<Fa icon={faStar} />
		{stars}
	</span>
	<span class="py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
		<Fa icon={faUserGroup} />
		{configCount}
	</span>
	<span class="px-2 rounded-full text-xs flex gap-1 items-center font-medium">
		{category}
	</span>
</div>
