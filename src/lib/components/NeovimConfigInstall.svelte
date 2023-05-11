<script>
	import { faCopy } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

  export let owner;
  export let repo;

  const code = `
git clone https://github.com/${owner}/${repo}.git ~/.config/${owner}/${repo}
NVIM_APPNAME=~/.config/${owner}/${repo} nvim`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    alert('Copied to clipboard!');
  }

</script>

<div class="relative flex flex-col justify-between overflow-hidden rounded-md border border-green-300/25 bg-white/5 transition-colors w-full shadow-lg hover:shadow-green-300/25">
  <div class="flex flex-col gap-2">
    <div class="p-4 rounded-lg">
      <div class="flex items-center justify-between">
        <span class="text-white font-semibold">Install (requires Neovim 0.9 or greater)</span>
        <button class="text-white hover:text-gray-400" on:click={copyToClipboard}>
          <Fa icon={faCopy} size="xs" />
        </button>
      </div>
      <div class="mt-2">
        <pre class="align-left text-white text-sm">
          <code>
            {code}
          </code>
        </pre>
      </div>
    </div>
  </div>
</div>

