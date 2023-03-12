<script lang="ts">
	import Fa from 'svelte-fa';
	import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
</script>

<form method="POST" action="?/githubLogin">
	<button
		class="bg-white/30 text-sm font-semibold p-4 py-2 xl:px-6 xl:py-2 rounded-full flex gap-1 items-center"
    type='submit'
	>
		<Fa icon={faGithub} /> Get Started <Fa class="ml-1" size="xs" icon={faArrowUpRightFromSquare} />
	</button>
</form>
