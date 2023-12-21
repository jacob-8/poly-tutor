<script lang="ts">
  import { dev } from '$app/environment'
  import { invalidateAll } from '$app/navigation'
  import { page } from '$app/stores'
  import { PUBLIC_INBUCKET_URL } from '$env/static/public'
  import { Button, Form, Modal } from 'svelte-pieces'
  import { toast } from '$lib/client/Toasts.svelte'

  export let close: () => void
  let email: string
  let sixDigitCodeSent = false
  let sixDigitCode: string
  const TEN_SECONDS = 10000
  const FOUR_SECONDS = 4000

  async function sendCode() {
    const { data, error } = await $page.data.supabase.auth.signInWithOtp({ email })
    console.info({ data, error })
    if (error) return toast(error.message, TEN_SECONDS)
    toast(`${$page.data.t.layout.sent_code}: ${email}`, FOUR_SECONDS)
    sixDigitCodeSent = true
  }

  let submitting_code = false
  async function handleOTP() {
    submitting_code = true
    const { data, error } = await $page.data.supabase.auth.verifyOtp({
      email,
      token: sixDigitCode.toString(),
      type: 'email',
    })
    console.info({ data, error })
    // eslint-disable-next-line require-atomic-updates
    sixDigitCode = null
    submitting_code = false
    if (error)
      return toast(error.message, TEN_SECONDS)

    toast(`Signed in with ${email}`, FOUR_SECONDS)
    invalidateAll()
  }

  $: code_is_6_digits = /^[0-9]{6}$/.test(sixDigitCode)
  $: if (code_is_6_digits && !submitting_code) handleOTP()

  function autofocus(node: HTMLInputElement) {
    setTimeout(() => node.focus(), 15)
  }

  async function auto_sign_in_on_dev() {
    if (!email)
      email = 'manual@mock.com'
    await sendCode()
    if (PUBLIC_INBUCKET_URL)
      window.open(`${PUBLIC_INBUCKET_URL}/monitor`, '_blank')
  }
</script>

<Modal on:close={close}>
  <div slot="heading">{$page.data.t.layout.sign_in}
    {#if submitting_code}
      <span class="i-svg-spinners-3-dots-fade align--4px" />
    {/if}
  </div>
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
        {#if dev}
          <Button form="simple" onclick={auto_sign_in_on_dev}>Dev: Auto-sign-in</Button>
        {/if}
        <Button {loading} form="filled" type="submit">{$page.data.t.layout.send_code}</Button>
      </div>
    </Form>
  {:else}
    <input
      type="text"
      placeholder="{$page.data.t.layout.enter_6_digit_code} ({email})"
      class="border border-gray-400 p-2 rounded w-full"
      maxlength="6"
      bind:value={sixDigitCode}
    />
  {/if}
</Modal>
