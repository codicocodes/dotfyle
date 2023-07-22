<script lang="ts">
export let loading = false;
</script>
<div
	class="
   {loading ? 'animate-pulse' : ''}
    flex overflow-hidden rounded-md
    bg-white/5 truncate text-ellipsis transition-colors
  "
>
	<slot />
</div>
