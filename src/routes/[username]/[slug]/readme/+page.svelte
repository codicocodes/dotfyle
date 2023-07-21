<script lang="ts">
	import HtmlContent from '$lib/components/HtmlContent.svelte';
import type { PageData } from './$types';
	export let data: PageData;
  console.log(data.readme)
</script>

<div class="px-4">
  <HtmlContent content={data.html} />
</div>
