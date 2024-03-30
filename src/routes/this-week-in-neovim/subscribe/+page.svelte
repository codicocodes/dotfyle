<script>
	import EmailSubscribe from '$lib/components/EmailSubscribe.svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';
</script>

<svelte:head>
	<title>{'Subscribe to This Week in Neovim'}</title>
	<OpenGraph
		title={'Subscribe to This Week in Neovim'}
		url="https://dotfyle.com/this-week-in-neovim/subscribe"
		description="Sign up with your email address to receive an email when a new issue of This Week in Neovim is available"
		image="/twin.png"
	/>
</svelte:head>

<EmailSubscribe />
