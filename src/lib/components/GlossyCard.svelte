<script lang="ts">
export let loading = false;
</script>
<div
	class="
   {loading ? 'animate-pulse' : ''}
    flex overflow-hidden rounded-md
    bg-black/30 text-ellipsis transition-colors border-[0.5px] border-accent-muted hover:border-accent-bright
  "
>
	<slot />
</div>
