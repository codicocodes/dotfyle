<script lang="ts">
  import { copyToClipboard } from '$lib/utils';
  import { faTwitter } from '@fortawesome/free-brands-svg-icons';
  import { faCopy, faEnvelope } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  interface Props {
    url: string;
    tweetText: string;
    emailSubject: string;
    emailBody: string;
  }

  let { url, tweetText, emailSubject, emailBody }: Props = $props();

  let utmPrefix = $derived(url.includes('?') ? '&' : '?');

  let twitterUrl = $derived(url + utmPrefix + 'utm_source=share-twitter');
  let emailUrl = $derived(url + utmPrefix + 'utm_source=share-email');
  let copyUrl = $derived(url + utmPrefix + 'utm_source=share-copy');

  let tweetUrl = $derived(
    `https://twitter.com/intent/tweet?url=${twitterUrl}&text=${tweetText}&via=codicocodes&`
  );
</script>

<div class="flex items-center gap-2">
  <button
    title="Copy url"
    class="block p-3 bg-black/30 rounded-full border-[1px] border-accent-muted hover:border-accent-bright"
    onclick={() => copyToClipboard(copyUrl)}
  >
    <Fa size="xs" icon={faCopy} />
  </button>
  <a
    title="Share on Twitter"
    href={tweetUrl}
    target="blank"
    class="block p-3 bg-black/30 rounded-full border-[1px] border-accent-muted hover:border-accent-bright"
  >
    <Fa size="xs" icon={faTwitter} />
  </a>
  <a
    class="block p-3 bg-black/30 rounded-full border-[1px] border-accent-muted hover:border-accent-bright"
    href="mailto:?subject={emailSubject}&amp;body={emailBody}: {emailUrl}"
    title="Share by Email"
  >
    <Fa size="xs" icon={faEnvelope} />
  </a>
</div>
