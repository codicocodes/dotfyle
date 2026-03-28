<script lang="ts">
	import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import CoolText from './CoolText.svelte';

	interface Props {
		text: string;
		href: string | undefined;
		target?: string | undefined;
	}

	let { text, href, target = '' }: Props = $props();
</script>

<a
	{href}
	{target}
	class={`flex items-center gap-1 text-main hover:underline underline-offset-4 decoration-2 ${
		href ? 'hover:cursor-pointer' : 'hover:cursor-not-allowed'
	}`}
>
	<CoolText {text} />
	<Fa icon={faChevronRight} size="xs" />
</a>
