<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	import HtmlContent from '$lib/components/HtmlContent.svelte';
	import Button from '$lib/components/Button.svelte';
	import { faEye, faSave } from '@fortawesome/free-solid-svg-icons';
	import { remark } from 'remark';
	import remarkHtml from 'remark-html';
	let clean = '';
	let preview = false;

  function openPreview() {
    clean =  remark().use(remarkHtml).processSync(data.post.content).toString();
    preview = true
  }
</script>

<Modal showModal={preview} onClose={() => (preview = false)}>
	<HtmlContent content={clean} />
</Modal>

<form method="POST">
	<div class="flex gap-2 mx-2">
		<Button type="button" icon={faEye} text="Preview" on:click={openPreview} />
		<Button formaction="?/update" icon={faSave} text="Save" />
		<Button formaction="?/publish" icon={faSave} text="Publish" />
	</div>

	<input
		name="title"
		class="editor-borders p-2 text-lg w-full m-2 outline-none rounded-md"
		bind:value={data.post.title}
	/>

	<textarea
		name="content"
		class="editor-borders rounded-md w-full min-h-[800px] p-8 text-lg m-2"
		bind:value={data.post.content}
	/>
</form>

<style>
	.editor-borders {
		@apply outline-none border-solid border-2 bg-transparent;
	}
</style>
