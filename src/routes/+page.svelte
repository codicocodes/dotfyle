<script lang="ts">
	import Fa from 'svelte-fa';
	import { faBox, faCircle, faPuzzlePiece, faStar } from '@fortawesome/free-solid-svg-icons';
</script>

<!-- header -->
<div class="mx-auto xl:max-w-7xl">
	<div class="flex flex-col justify-center items-center">
		<div class="py-12 sm:py-8 md:py-12 lg:py-14 xl:py-12 2xl:py-28">
			<div class="flex justify-center items-center">
				<div
					class="max-w-md px-4 sm:max-w-2xl sm:px-6 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-7xl"
				>
					<h1
						class="text-center text-4xl font-bold tracking-tight text-white sm:text-6xl sm:tracking-tight lg:text-[4rem] xl:text-[6rem] xl:tracking-tight 2xl:text-[6.5rem]"
					>
						Discover and share <span
							class="text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-green-500"
							>Neovim</span
						> configs
					</h1>
				</div>
			</div>

			<div class="flex justify-center items-center my-4 md:my-6 lg:my-8 xl:my-12">
				<div
					class="max-w-md px-4 sm:max-w-2xl sm:px-6 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-7xl"
				>
					<h2
						class="text-center font-semibold tracking-tight text-white sm:text-lg sm:tracking-tight lg:text-xl xl:text-2xl xl:tracking-tight"
					>
						Signup with GitHub to add your config
					</h2>
				</div>
			</div>

			<div class="w-full flex justify-center items-center">
				<button class="bg-white/30 text-sm font-semibold p-4 py-2 xl:px-6 xl:py-3 rounded-full">
					Add your config
				</button>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-7xl px-4 pb-12 text-purple-100 sm:px-6 lg:px-8">
		<div class="mb-10 md:text-center">
			<h2 class="text-xl font-semibold md:text-2xl lg:text-2xl">Community configs</h2>
		</div>

		<div>
			<div
				class="space-y-10 sm:grid sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3 sm:gap-x-6 sm:gap-y-14 sm:space-y-0 md:grid-cols-3 md:grid-rows-2 lg:gap-x-8"
			>
				<div
					class="relative flex flex-col justify-between overflow-hidden rounded-md border border-purple-300/20 bg-white/5 transition-colors"
				>
					<div
						class="flex items-center space-x-4 bg-white/10 p-2 pl-5 transition-colors hover:bg-white/20"
					>
						<img
							src="https://avatars.githubusercontent.com/u/76068197?v=4"
							alt=""
							class="h-10 w-10 rounded-full"
						/>
						<div>
							<p class="text-lg font-medium md:text-xl">codicocodes</p>
							<p class="text-md font-medium md:text-lg">dotfiles/nvim</p>
						</div>
					</div>
					<div class="my-4 m-2 flex font-medium">
						<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
              <Fa icon={faStar} /> 69 
            </span>
						<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
              <Fa icon={faCircle} /> lua 
            </span>
						<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
              <Fa icon={faBox} /> packer.nvim 
            </span>
						<span class="px-2 py-1 rounded-full text-xs flex gap-1 items-center font-semibold">
              <Fa icon={faPuzzlePiece} /> 420 
            </span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
