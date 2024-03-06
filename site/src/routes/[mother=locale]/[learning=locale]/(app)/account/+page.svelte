<script lang="ts">
  import { dev } from '$app/environment'

  // import type { NewUserEmailRequestBody } from '$api/email/new-user/+server.js'
  // import { post_request } from '$lib/utils/post-request.js'

  export let data
  $: ({ user } = data)

  async function update_email() {
    const email = prompt('Enter new email')
    if (!email) return
    const { data: update_data, error } = await data.supabase.auth.updateUser({
      email,
    })
    console.info({ update_data, error })
    if (error) return alert(error.message)
  }

  // async function send_welcome() {
  //   const { data, error } = await post_request<
  //     NewUserEmailRequestBody,
  //     { result: string }
  //   >('/api/email/new-user', {
  //     language: 'en',
  //   })
  //   console.info({ data, error })
  // }

  async function test_endpoint() {
    const { data: update_data, error } = await data.supabase
      .from('test_updates')
      .insert([{ content: 'foo' }])
      .select()
    console.info({ update_data, error })
    if (error) return alert(error.message)
  }
</script>

<div class="m-3">
  {#if $user}
    <button type="button" on:click={update_email}>
      Update email (currently {$user.email})
    </button>

    {#if dev}
      <button type="button" on:click={test_endpoint}> Test Edge Function Connected Endpoint </button>
    {/if}
  {/if}
</div>

<!-- Will send user a link with /en/zh-TW#message=Confirmation+link+accepted.+Please+proceed+to+confirm+link+sent+to+the+other+email ending -->
