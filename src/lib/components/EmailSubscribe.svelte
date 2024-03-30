<script>
	import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	let isfocused = false;
	export let title = 'Email Newsletter';
	export let description =
		'Sign up with your email address to receive an email when a new issue of This Week in Neovim is available';
</script>

<div
	id="subscribe"
	class="flex flex-col md:flex-row items-center border border-accent-muted hover:border-accent-bright rounded-lg transition duration-200 p-6 gap-4"
>
	<div>
		<h3 class="flex gap-2 items-center text-2xl font-kai mb-4 text-black dark:text-white font-bold">
			<Fa icon={faEnvelope} />
			{title}
		</h3>
		<p>{description}</p>
	</div>
	<form
		class="w-full flex md:flex-row flex-col gap-2 md:gap-0 md:items-center items-start justify-center"
		action="https://app.convertkit.com/forms/6395805/subscriptions"
		method="POST"
	>
		<div
			class="flex gap-2 w-full sm:w-3/4 md:w-2/3 xl:w-1/2 items-center p-2 sm:p-3 rounded-lg text-black text-sm font-medium focus:outline-none focus:border-main shadow-xl focus:shadow-main/25 focus:ring-1 focus:ring-main bg-white {isfocused
				? 'shadow-xl shadow-main/25'
				: ''}"
		>
			<input
				name="email_address"
				type="email"
				required
				placeholder="example@email.com"
				class="bg-transparent focus:outline-none w-full"
				on:focus={() => (isfocused = true)}
				on:blur={() => (isfocused = false)}
			/>
		</div>
		<div class="mx-2">
			<button
				class="flex justify-between transition-all border-accent-muted bg-black/30 py-2 px-4 rounded-lg border-[1px] flex items-center hover:border-secondary font-semibold text-lg gap-2"
			>
				Subscribe
			</button>
		</div>
	</form>
</div>
