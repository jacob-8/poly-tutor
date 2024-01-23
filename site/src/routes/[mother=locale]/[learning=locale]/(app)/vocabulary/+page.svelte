<script lang="ts">
  import { post_request } from '$lib/utils/post-request'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({user_vocabulary, user} = data)
</script>

{#if $user?.email === 'jacob@polylingual.dev'}
  <button type="button" on:click={async () => {
    const url = prompt('Enter url')
    if (!url) return
    const { data, error } = await post_request('/api/sync-vocab', { url })
    console.info({data, error})
  }}>Migrate Vocab</button>
{/if}


Count: {Object.keys($user_vocabulary).length}
<hr>
<pre>{JSON.stringify($user_vocabulary, null, 2)}</pre>
