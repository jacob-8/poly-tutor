<script lang="ts">
  import type { NewUserEmailRequestBody } from '$api/email/new-user/+server.js'
  import { post_request } from '$lib/utils/post-request.js'

  export let data
  $: ({user} = data)

  async function update_email() {
    const email = prompt('Enter new email')
    if (!email) return
    const { data: update_data, error } = await data.supabase.auth.updateUser({ email})
    console.info({update_data, error})
    if (error) return alert(error.message)
  }

  async function send_welcome() {
    const { data, error } = await post_request<NewUserEmailRequestBody, { result: string}>('/api/email/new-user', {
      email: $user.email,
      name: 'Jacob',
    })
    console.info({data, error})
  }
</script>

<div class="m-3">
  {#if $user}
    <button type="button" on:click={update_email}>
      Update email (currently {$user.email})
    </button>

    <button type="button" on:click={send_welcome}>
      Send Welcome
    </button>
  {/if}
</div>

<!-- Will send user a link with /en/zh-TW#message=Confirmation+link+accepted.+Please+proceed+to+confirm+link+sent+to+the+other+email ending -->
