<script lang="ts">
	import { page } from '$app/stores';
	import { navigate } from '$lib/navigate';
	import { faCircleXmark, faSearch } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let search = $page.url.searchParams.get('q') ?? '';

	export let placeholder: string;

	let isfocused = false;
	let inputRef: HTMLInputElement;
</script>

<form
	action=""
	class="grow flex justify-center items-center mt-6 mb-4 gap-2"
	on:submit|preventDefault={() => {
		navigate($page, 'page', '1');
		navigate($page, 'q', search, true);
	}}
>
	<!-- TODO: move to global search and move to other component-->
	<div
		class="flex gap-2 w-full sm:w-3/4 md:w-2/3 xl:w-1/2 items-center p-2 sm:p-3 rounded-full text-black text-sm font-medium focus:outline-none focus:border-main shadow-xl focus:shadow-main/25 focus:ring-1 focus:ring-main bg-white/80 {isfocused
			? 'shadow-xl shadow-main/25'
			: ''}"
	>
		<Fa icon={faSearch} class="ml-1" />
		<input
			bind:this={inputRef}
			type="search"
			bind:value={search}
			{placeholder}
			class="bg-transparent focus:outline-none w-full"
			on:focus={() => (isfocused = true)}
			on:blur={() => (isfocused = false)}
		/>
		{#if search}
			<button
				type="button"
				on:click={() => {
					search = '';
					navigate($page, 'q', search, true);
					inputRef.focus();
				}}
			>
				<Fa icon={faCircleXmark} class="mr-1" />
			</button>
		{/if}
	</div>
</form>
