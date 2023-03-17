<script lang="ts">
	import AddNewConfig from "$lib/components/add/AddNewConfig.svelte";
	import CoolText from "$lib/components/CoolText.svelte";
	import HeroTitle from "$lib/components/HeroTitle.svelte";
	import type { PageData } from "./$types";

  export let data: PageData
  const { user, repositories } = data

</script>
<div class="flex flex-col justify-center items-center">
	<HeroTitle>
		Welcome to <CoolText text="Dotfyle" />
	</HeroTitle>
  <AddNewConfig user={user} repositories={repositories} />
</div>
