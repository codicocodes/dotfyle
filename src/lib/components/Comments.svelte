<script lang="ts">
	import { afterNavigate } from '$app/navigation';

	afterNavigate(async () => {
		const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
		iframe?.contentWindow?.postMessage(
			{ giscus: { setConfig: { term: window.location.pathname } } },
			'https://giscus.app'
		);
	});
</script>

<head>
	<script
		src="https://giscus.app/client.js"
		data-repo="codicocodes/dotfyle"
		data-repo-id="R_kgDOJKADOg"
		data-category="This Week in Neovim"
		data-category-id="DIC_kwDOJKADOs4CdHVi"
		data-mapping="pathname"
		data-strict="0"
		data-reactions-enabled="1"
		data-emit-metadata="0"
		data-input-position="bottom"
		data-theme="preferred_color_scheme"
		data-lang="en"
		crossorigin="anonymous"
		async
	></script>
</head>

<div id="comments" class="giscus" />
