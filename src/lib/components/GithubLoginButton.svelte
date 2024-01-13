<script lang="ts">
	import Fa from 'svelte-fa';
	import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { DoubleBounce } from 'svelte-loading-spinners';
	import { goto } from '$app/navigation';
	import { isMaintenanceMode } from '$lib/utils';
	let loading = false;
	$: disabled = loading || isMaintenanceMode();
</script>

<form>
	<button
		{disabled}
		on:click={() => {
			if (!disabled) {
				goto('/api/auth/github');
			}
			loading = true;
		}}
	>
		<a
			href={disabled ? null : '/api/auth/github'}
			class={`bg-black/30 border-[1px] border-accent-muted hover:border-accent-bright text-sm font-semibold p-4 py-2 xl:px-6 xl:py-2 rounded-full flex gap-4 items-center hover:bg-gradient-main ${
				disabled
					? 'hover:bg-white/5 hover:cursor-not-allowed'
					: 'hover:bg-gradient-primary shadow-xl hover:shadow-main/25'
			}`}
		>
			<Fa icon={faGithub} />

			Login | Sign up

			{#if loading}
				<DoubleBounce color="#15be97" size="8" />
			{:else}
				<Fa class="ml-1" size="xs" icon={faArrowUpRightFromSquare} />
			{/if}
		</a>
	</button>
</form>
