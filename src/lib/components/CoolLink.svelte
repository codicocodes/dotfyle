<script lang="ts">
	import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import CoolText from './CoolText.svelte';

	export let text: string;
	export let href: string | undefined;
	export let target: string | undefined = "";
</script>

<a
	{href}
  {target}
	class={`font-semibold flex items-center gap-1 text-green-500 hover:underline underline-offset-4 decoration-2 ${
		href ? 'hover:cursor-pointer' : 'hover:cursor-not-allowed'
	}`}
>
	<CoolText {text} />
	<Fa icon={faChevronRight} size="xs" />
</a>
