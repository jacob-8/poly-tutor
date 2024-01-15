<script lang="ts">
  import { browser, dev } from '$app/environment'
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
    sign_in_success(email)
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

  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.handleSignInWithGoogle = async function handleSignInWithGoogle(response) {
      const { data, error } = await $page.data.supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      })
      console.info({data,error})
      if (!error)
        sign_in_success(data?.user?.email)

    }
  }

  function sign_in_success(_email: string) {
    toast(`Signed in with ${_email}`, FOUR_SECONDS)
    invalidateAll()
    close()
  }

  $: can_google_authenticate = browser && !location.origin.includes('vercel.app')
</script>

<svelte:head>
  {#if can_google_authenticate}
    <script src="https://accounts.google.com/gsi/client" async></script>
  {/if}
</svelte:head>

<Modal on:close={close}>
  <div slot="heading">{$page.data.t.layout.sign_in}
    {#if submitting_code}
      <span class="i-svg-spinners-3-dots-fade align--4px" />
    {/if}
    {#if dev && !sixDigitCodeSent}
      <Button size="sm" form="simple" onclick={auto_sign_in_on_dev}>Dev-Auto</Button>
    {/if}
  </div>
  {#if !sixDigitCodeSent}
    {#if can_google_authenticate}
      <div class="mb-3">
        <div id="g_id_onload"
          data-client_id="962436367701-8f24318dmnh6ce75ig7p11lallvcr9eb.apps.googleusercontent.com"
          data-context="signin"
          data-ux_mode="popup"
          data-callback="handleSignInWithGoogle"
          data-auto_select="true"
          data-itp_support="true">
        </div>

        <div class="g_id_signin"
          data-type="standard"
          data-shape="rectangular"
          data-theme="outline"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left">
        </div>
        <!-- signin_with or signin -->
      </div>

      <div class="mb-3 text-gray-500/80 text-sm font-semibold">
        OR
      </div>
    {/if}

    <Form let:loading onsubmit={sendCode}>
      <div class="flex">
        <input
          type="email"
          use:autofocus
          placeholder={$page.data.t.layout.enter_email_address}
          class="border border-gray-400 p-2 rounded w-full"
          required
          bind:value={email}
        />
        <Button class="text-nowrap ml-1" {loading} form="filled" type="submit">{$page.data.t.layout.send_code}</Button>

      </div>
    </Form>
  {:else}
    <div class="mb-2">
      {$page.data.t.layout.enter_6_digit_code_sent_to}: {email}
    </div>
    <input
      type="text"
      placeholder="_ _ _ _ _ _"
      class="border border-gray-400 p-2 rounded w-full"
      maxlength="6"
      bind:value={sixDigitCode}
    />
  {/if}
</Modal>
