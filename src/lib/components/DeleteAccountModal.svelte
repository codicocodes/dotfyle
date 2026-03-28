<script lang="ts">
	import { self } from 'svelte/legacy';

	interface Props {
		showModal: boolean;
		username: string;
		onClose: () => void;
		onConfirm: () => Promise<void>;
	}

	let {
		showModal,
		username,
		onClose,
		onConfirm
	}: Props = $props();

	let inputValue = $state('');
	let loading = $state(false);

	let canConfirm = $derived(inputValue === username && !loading);
	let confirmButtonClass = $derived(canConfirm
		? 'border-red-500/60 hover:border-red-400 text-red-400'
		: 'border-base-700 text-base-600 cursor-not-allowed');

	async function handleConfirm() {
		loading = true;
		try {
			await onConfirm();
		} finally {
			loading = false;
		}
	}

	function handleClose() {
		inputValue = '';
		onClose();
	}
</script>

{#if showModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
		onclick={self(handleClose)}
		onkeydown={(e) => e.key === 'Escape' && handleClose()}
		role="dialog"
		aria-modal="true"
		aria-labelledby="delete-modal-title"
		tabindex="-1"
	>
		<div class="bg-base-900 border border-base-700 rounded-xl p-6 w-full max-w-md flex flex-col gap-4 mx-4">
			<h2 id="delete-modal-title" class="text-xl font-semibold">Delete your account</h2>
			<p class="text-base-400 text-sm">
				This action is <span class="text-white font-semibold">permanent and irreversible</span>.
				Your profile, configurations, and all associated data will be deleted.
			</p>
			<div class="flex flex-col gap-2">
				<label for="confirm-username" class="text-sm text-base-400">
					Type <span class="font-mono text-white">{username}</span> to confirm
				</label>
				<input
					id="confirm-username"
					type="text"
					bind:value={inputValue}
					placeholder={username}
					class="bg-black/30 border border-base-700 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-base-400 w-full"
				/>
			</div>
			<div class="flex gap-2 justify-end">
				<button
					class="px-4 py-2 rounded-lg border border-base-700 hover:border-base-400 text-sm transition-all"
					onclick={handleClose}
					disabled={loading}
				>
					Cancel
				</button>
				<button
					class="px-4 py-2 rounded-lg border text-sm transition-all {confirmButtonClass}"
					onclick={handleConfirm}
					disabled={!canConfirm}
				>
					{loading ? 'Deleting…' : 'Delete account'}
				</button>
			</div>
		</div>
	</div>
{/if}
