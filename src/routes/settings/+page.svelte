<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { trpc } from '$lib/trpc/client';
  import { session } from '$lib/stores/session';
  import DeleteAccountModal from '$lib/components/DeleteAccountModal.svelte';

  let { data } = $props();

  let showDeleteModal = $state(false);
  let deleteError = $state('');

  async function handleDeleteConfirmed() {
    deleteError = '';
    await trpc($page).deleteAccount.mutate();
    $session.user = null;
    goto('/');
  }
</script>

<svelte:head>
  <title>Settings — Dotfyle</title>
</svelte:head>

<div class="flex flex-col gap-8 max-w-2xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold">Settings</h1>

  <section class="flex flex-col gap-4">
    <h2 class="text-xl font-semibold">Account</h2>
    <div class="flex flex-col gap-1">
      <span class="text-base-400 text-sm">Username</span>
      <p class="font-mono">{data.user.username}</p>
    </div>

    <div class="border-t border-base-800 pt-4 flex flex-col gap-3">
      <h3 class="text-base font-semibold text-red-400">Danger Zone</h3>
      {#if deleteError}
        <p class="text-red-400 text-sm">{deleteError}</p>
      {/if}
      <button
        class="border border-red-500/60 hover:border-red-400 bg-black/30 px-4 py-2 rounded-lg text-sm self-start transition-all text-red-400"
        onclick={() => (showDeleteModal = true)}
      >
        Delete account
      </button>
    </div>
  </section>
</div>

<DeleteAccountModal
  showModal={showDeleteModal}
  username={data.user.username}
  onClose={() => {
    showDeleteModal = false;
    deleteError = '';
  }}
  onConfirm={async () => {
    try {
      await handleDeleteConfirmed();
    } catch (e) {
      deleteError = e instanceof Error ? e.message : 'An error occurred';
      showDeleteModal = false;
    }
  }}
/>
