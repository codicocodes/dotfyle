<script>
	import Button from '$lib/components/Button.svelte';
	import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
</script>

<form class="w-full flex gap-2 justify-center" method="POST">
	<div class="flex flex-col">
		<label class=""> issue number </label>
		<input type="number" class="rounded px-2 text-black" name="issue"/>
	</div>
	<div class="flex flex-col">
		<label class="">days ago</label>
		<input type="number" class="rounded px-2 text-black" name="days"/>
	</div>
	<Button text="Create" icon={faPlusCircle} />
</form>
