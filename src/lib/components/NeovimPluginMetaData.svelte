<script lang="ts">
	import { faArrowTrendUp, faStar, faUserGroup, faUsers } from '@fortawesome/free-solid-svg-icons';

	import Fa from 'svelte-fa';

	export let stars: string;
	export let configCount: number;
	export let category: string;
	export let addedLastWeek: number;
</script>

<div class="flex gap-4 font-medium">
	<span title="GitHub stars" class="py-1 rounded-full flex gap-1 items-center font-semibold">
		<Fa icon={faStar} />
		{stars}
	</span>
	<span
		title="Total installs on Dotfyle"
		class="py-1 rounded-full flex gap-1 items-center font-semibold"
	>
		<Fa icon={faUsers} />
		{configCount}
	</span>
	<span
		title="Installs last week"
		class="py-1 rounded-full flex gap-1 items-center font-semibold"
	>
		<Fa icon={faArrowTrendUp} />
		{addedLastWeek}
	</span>
	<span class="px-2 rounded-full text-xs flex gap-1 items-center font-medium">
		{category}
	</span>
</div>
