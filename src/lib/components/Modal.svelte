<script lang="ts">
	import { faCheck } from "@fortawesome/free-solid-svg-icons";
	import Button from "./Button.svelte";

	export let showModal: boolean;
  export let onClose: () => void

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
class="bg-neutral-700 text-white"
	bind:this={dialog}
	on:close={() => onClose()}
	on:click|self={() => dialog.close()}
>
	<div on:click|stopPropagation>
		<slot name="header" />
		<slot />
	<div class="flex w-full justify-center">
    <Button icon={faCheck} text="Done" loading={false} on:click={() => dialog.close()}/>
	</div>
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
