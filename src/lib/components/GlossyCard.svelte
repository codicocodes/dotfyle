<script lang="ts">
export let loading = false;
</script>
<div
	class="
   {loading ? 'animate-pulse' : ''}
    flex overflow-hidden rounded-md border border-green-300/25 
    bg-white/5 truncate text-ellipsis transition-colors
    shadow-md hover:shadow-green-300/25
  "
>
	<slot />
</div>
