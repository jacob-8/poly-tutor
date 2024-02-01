<script lang="ts">
  import type { SyncVocabRequestBody, SyncVocabResponseBody } from '$api/sync-vocab/+server'
  import { post_request } from '$lib/utils/post-request'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({user_vocabulary, user} = data)

  async function sync_vocab() {
    const url = prompt('Enter url')
    if (!url) return
    const { data, error } = await post_request<SyncVocabRequestBody, SyncVocabResponseBody>('/api/sync-vocab', { url })
    console.info({data, error})
  }
</script>

{#if $user?.email === 'jacob@polylingual.dev'}
  <button type="button" on:click={sync_vocab}>Migrate Vocab</button>
{/if}


Count: {Object.keys($user_vocabulary).length}
<hr>
<pre>{JSON.stringify($user_vocabulary, null, 2)}</pre>
