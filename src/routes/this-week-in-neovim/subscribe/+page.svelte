<script>
	import { browser } from '$app/environment';
	import OpenGraph from '$lib/components/OpenGraph.svelte';
	import { getTheme } from '$lib/theme';
	if (browser) {
		const theme = getTheme();
		if (theme === 'dark')
			window.fd('form', {
				formId: '6606dd05f4a205deae5f1915',
				containerEl: '#fd-form-6606dd05f4a205deae5f1915'
			});

		if (theme === 'light')
			window.fd('form', {
				formId: '6606e0680835cf37369dbe00',
				containerEl: '#fd-form-6606e0680835cf37369dbe00'
			});
	}
</script>

<svelte:head>
	<title>{'Subscribe to This Week in Neovim'}</title>
	<OpenGraph
		title={'Subscribe to This Week in Neovim'}
		url="https://dotfyle.com/this-week-in-neovim/subscribe"
		description="Sign up with your email address to receive an email when a new issue of This Week in Neovim is available"
		image="/twin.png"
	/>

	<script>
		(function (w, d, t, h, s, n) {
			w.FlodeskObject = n;
			var fn = function () {
				(w[n].q = w[n].q || []).push(arguments);
			};
			w[n] = w[n] || fn;
			var f = d.getElementsByTagName(t)[0];
			var v = '?v=' + Math.floor(new Date().getTime() / (120 * 1000)) * 60;
			var sm = d.createElement(t);
			sm.async = true;
			sm.type = 'module';
			sm.src = h + s + '.mjs' + v;
			f.parentNode.insertBefore(sm, f);
			var sn = d.createElement(t);
			sn.async = true;
			sn.noModule = true;
			sn.src = h + s + '.js' + v;
			f.parentNode.insertBefore(sn, f);
		})(window, document, 'script', 'https://assets.flodesk.com', '/universal', 'fd');
	</script>
</svelte:head>

<div id="fd-form-6606dd05f4a205deae5f1915" />
<div id="fd-form-6606e0680835cf37369dbe00" />
