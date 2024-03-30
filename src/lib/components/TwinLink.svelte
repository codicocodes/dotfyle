<script>
	import { faChevronCircleRight, faEnvelope, faExternalLink, faExternalLinkSquare, faLink } from "@fortawesome/free-solid-svg-icons";


	import Fa from "svelte-fa";

</script>

<div class="flex justify-center w-full">
	<div class="w-full sm:w-3/4 md:w-2/3 xl:w-1/2">
		<a
			href="/this-week-in-neovim"
			class="flex flex-col justify-between rounded-lg bg-black/30 transition-all shadow-lg p-2 px-5 border-[0.5px] border-accent-muted hover:border-secondary hover:text-transparent hover:bg-clip-text hover:bg-gradient-primary"
		>
			<span class="text-lg font-semibold flex gap-2 items-center justify-between">
				<span class="flex gap-2 items-center"><Fa class="force-white-text" icon={faEnvelope} />This Week in Neovim</span>
				<Fa class="force-white-text" size="sm" icon={faChevronCircleRight} />
				</span>
			<span class="font-light inline-flex force-white-text">
				Weekly newsletter about Neovim and the plugin ecosystem.
			</span>
		</a>
	</div>
</div>
