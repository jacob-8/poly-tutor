<script lang="ts">
  // https://developers.google.com/identity/gsi/web/guides/overview
  import { page } from '$app/stores'

  // @ts-ignore
  window.handleSignInWithGoogle = async function handleSignInWithGoogle(response) {
    const { data, error } = await $page.data.supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    })
    console.info({data,error})
  }
</script>

<svelte:head>
  <script src="https://accounts.google.com/gsi/client" async></script>
</svelte:head>

<!-- Setup w/ One-Tap option -->
<div id="g_id_onload"
  data-client_id="962436367701-8f24318dmnh6ce75ig7p11lallvcr9eb.apps.googleusercontent.com"
  data-context="signin"
  data-ux_mode="popup"
  data-callback="handleSignInWithGoogle"
  data-auto_select="true"
  data-itp_support="true">
</div>

<!-- Prep for Login with Google Button w/o also having One-Tap -->
<!-- <div id="g_id_onload"
  data-client_id="962436367701-8f24318dmnh6ce75ig7p11lallvcr9eb.apps.googleusercontent.com"
  data-context="signin"
  data-ux_mode="popup"
  data-callback="handleSignInWithGoogle"
  data-auto_prompt="false">
</div> -->
