<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
  $: ({user_vocabulary, user} = data)
</script>

{#if $user.email === 'jacob@polylingual.dev'}
  <button type="button" on:click={async () => {
    const { add_vocab } = await import('./import')
    add_vocab(data.supabase)
  }}>Add vocab</button>
{/if}


Count: {Object.keys($user_vocabulary).length}
<hr>
<pre>{JSON.stringify($user_vocabulary, null, 2)}</pre>
