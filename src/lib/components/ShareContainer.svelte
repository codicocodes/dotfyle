<script lang="ts">
	import { copyToClipboard } from '$lib/utils';
	import { faTwitter } from '@fortawesome/free-brands-svg-icons';
	import { faCopy, faEnvelope } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let url: string;
	export let tweetText: string;
	export let emailSubject: string;
	export let emailBody: string;
	$: tweetUrl = `https://twitter.com/intent/tweet?url=${url}&text=${tweetText}&via=codicocodes`;
</script>

<div class="flex items-center gap-2">
	<button
		title="Copy url"
		class="block p-4 bg-gray-800 rounded-full"
		on:click={() => copyToClipboard(url)}
	>
		<Fa size="xs" icon={faCopy} />
	</button>
	<a
		title="Share on Twitter"
		href={tweetUrl}
		target="blank"
		class="block p-4 bg-gray-800 rounded-full"
	>
		<Fa size="xs" icon={faTwitter} />
	</a>
	<a
		class="block p-4 bg-gray-800 rounded-full"
		href="mailto:?subject={emailSubject}&amp;body={emailBody}: {url}"
		title="Share by Email"
	>
		<Fa size="xs" icon={faEnvelope} />
	</a>
</div>
