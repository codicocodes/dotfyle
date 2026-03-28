<script>
  import Button from '$lib/components/Button.svelte';
  import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
</script>

<form class="w-full flex gap-2 justify-center" method="POST">
  <div class="flex flex-col">
    <label for="issue"> issue number </label>
    <input id="issue" type="number" class="rounded px-2 text-gray" name="issue" />
  </div>
  <div class="flex flex-col">
    <label for="days">days ago</label>
    <input id="days" type="number" class="rounded px-2 text-gray" name="days" />
  </div>
  <Button text="Create" icon={faPlusCircle} />
</form>
