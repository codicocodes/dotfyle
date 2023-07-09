<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	import DOMPurify from 'dompurify';
	import { marked } from 'marked';
	import HtmlContent from '$lib/components/HtmlContent.svelte';
	import Button from '$lib/components/Button.svelte';
	import { faEye, faEyeSlash, faSave } from '@fortawesome/free-solid-svg-icons';
	let clean = '';
	let preview = false;

	$: {
		const purify = DOMPurify(window);
		clean = purify.sanitize(marked.parse(data.post.content));
	}
</script>

<Modal showModal={preview} onClose={() => (preview = false)}>
	<HtmlContent content={clean} />
</Modal>

<form method="POST">
	<div class="flex gap-2 mx-2">
		<Button type="button" icon={faEye} text="Preview" on:click={() => (preview = true)} />
		<Button formaction='?/update' icon={faSave} text="Save" />
		<Button formaction='?/publish' icon={faSave} text="Publish" />
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
