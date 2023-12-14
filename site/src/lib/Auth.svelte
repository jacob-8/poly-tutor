<script lang="ts">
  import { invalidateAll } from '$app/navigation'
  import { page } from '$app/stores'
  import { PUBLIC_INBUCKET_URL } from '$env/static/public'
  import { Button, Form, Modal } from 'svelte-pieces'
  import { toast } from 'svelte-pieces/ui/Toasts.svelte'

  let email: string
  let sixDigitCodeSent = false
  let sixDigitCode: number
  const TEN_SECONDS = 10000
  const FOUR_SECONDS = 4000

  async function sendCode() {
    const { data, error } = await $page.data.supabase.auth.signInWithOtp({ email })
    console.info({ data, error })
    if (error) return toast(error.message, TEN_SECONDS)
    toast(`${$page.data.t.layout.sent_code}: ${email}`, FOUR_SECONDS)
    sixDigitCodeSent = true

    if (PUBLIC_INBUCKET_URL)
      window.open(`${PUBLIC_INBUCKET_URL}/monitor`, '_blank')
  }

  async function handleOTP() {
    const { data, error } = await $page.data.supabase.auth.verifyOtp({
      email,
      token: sixDigitCode.toString(),
      type: 'email',
    })
    console.info({ data, error })
    if (error) return toast(error.message, TEN_SECONDS)
    toast(`Signed in with ${email}`, FOUR_SECONDS)
    invalidateAll()
  }

  const sixDigitCodePattern = '[0-9]{6}'

  function autofocus(node: HTMLInputElement) {
    setTimeout(() => node.focus(), 15)
  }
</script>

<Modal on:close>
  <div slot="heading">{$page.data.t.layout.sign_in}</div>
  {#if !sixDigitCodeSent}
    <Form let:loading onsubmit={sendCode}>
      <input
        type="email"
        use:autofocus
        placeholder={$page.data.t.layout.email_address}
        class="border border-gray-400 p-2 rounded w-full"
        required
        bind:value={email}
      />
      <div class="modal-footer">
        <Button {loading} form="filled" type="submit">{$page.data.t.layout.send_code}</Button>
      </div>
    </Form>
  {:else}
    <Form let:loading onsubmit={handleOTP}>
      <input
        type="text"
        placeholder="{$page.data.t.layout.enter_6_digit_code} ({email})"
        class="border border-gray-400 p-2 rounded w-full"
        pattern={sixDigitCodePattern}
        required
        bind:value={sixDigitCode}
      />
      <div class="modal-footer">
        <Button {loading} form="filled" type="submit">{$page.data.t.layout.sign_in}</Button>
      </div>
    </Form>
  {/if}
</Modal>

{#await import('svelte-pieces/ui/Toasts.svelte') then { default: Toasts }}
  <Toasts />
  <!-- Place in layout and improve from https://github.dev/beyonk-group/svelte-notifications -->
{/await}
