<script lang="ts">
	export let title: string;
	export let description: string;
	export let url: string;
</script>

<meta name="description" content={description} />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={url} />
<meta property="og:image" content="/dotfyle.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@codicocodes" />
<meta name="twitter:creator" content="@codicocodes" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content="/dotfyle.png" />
