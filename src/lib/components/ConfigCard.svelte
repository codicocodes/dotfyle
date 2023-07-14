<script lang="ts">
	import Fa from 'svelte-fa';
	import { faStar } from '@fortawesome/free-solid-svg-icons';
	import CoolTextOnHover from './CoolTextOnHover.svelte';
	export let avatar: string;
	export let owner: string;
	export let repo: string;
	export let stars: string;
	export let tools: string[];
  const icons = {
    neovim: `<svg
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			width="15"
			height="15"
			viewBox="0 0 214 214"
			aria-label="Neovim"
		>
			<title>Neovim</title>
			<defs>
				<linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
					<stop stop-color="#16B0ED" stop-opacity=".8" offset="0%" />
					<stop stop-color="#0F59B2" stop-opacity=".837" offset="100%" />
				</linearGradient>
				<linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="b">
					<stop stop-color="#7DB643" offset="0%" />
					<stop stop-color="#367533" offset="100%" />
				</linearGradient>
				<linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="c">
					<stop stop-color="#88C649" stop-opacity=".8" offset="0%" />
					<stop stop-color="#439240" stop-opacity=".84" offset="100%" />
				</linearGradient>
			</defs>
			<g fill="none" fill-rule="evenodd">
				<path
					d="M.027 45.459L45.224-.173v212.171L.027 166.894V45.459z"
					fill="url(#a)"
					transform="translate(1 1)"
				/>
				<path
					d="M129.337 45.89L175.152-.149l-.928 212.146-45.197-45.104.31-121.005z"
					fill="url(#b)"
					transform="matrix(-1 0 0 1 305 1)"
				/>
				<path
					d="M45.194-.137L162.7 179.173l-32.882 32.881L12.25 33.141 45.194-.137z"
					fill="url(#c)"
					transform="translate(1 1)"
				/>
				<path
					d="M46.234 84.032l-.063 7.063-36.28-53.563 3.36-3.422 32.983 49.922z"
					fill-opacity=".13"
					fill="#000"
				/>
			</g>
		</svg>`
  } as Record<string, string>
</script>

<div class="bg-white/10 p-2 rounded flex flex-col gap-2 center my-4 border border-green-300/25">
	<div class="flex gap-2 items-center">
		<img src={avatar} alt="" class="h-6 w-6 rounded-full" height="10" width="10" />
		<CoolTextOnHover>
			<span class="font-semibold">
				{owner}
			</span>
		</CoolTextOnHover>
		<span class="font-light"> / </span>
		<CoolTextOnHover>
			<span class="font-semibold">
				{repo}
			</span>
		</CoolTextOnHover>
	</div>
	<div class="flex gap-1 items-center">
		<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
			<Fa icon={faStar} />
			{stars}
		</span>
    {#each tools as tool}
      {@html icons[tool]}
    {/each}
	</div>
</div>
