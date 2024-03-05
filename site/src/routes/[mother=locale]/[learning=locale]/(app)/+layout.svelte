<script lang="ts">
  import './main.css'
  import { page } from '$app/stores'
  import User from '$lib/layout/User.svelte'
  import { ShowHide } from 'svelte-pieces'
  import SelectLanguage from '$lib/i18n/SelectLanguage.svelte'
  import { invalidateAll } from '$app/navigation'
  import { browser } from '$app/environment'

  export let data
</script>

{#if !$page.data.youtube_id}
  <div class="flex items-center space-x-1 py-1 pl-1" data-sveltekit-preload-data="tap">
    <div class="text-lg font-semibold flex items-center truncate py-1">
      {#if $page.url.pathname.includes('playlists')}
        <a href="../../shows" class="mr-1">
          <span class="i-iconamoon-arrow-left-1 my-1" /></a>
        <span class="i-logos-youtube-icon text-125% mr-1 view-transition-yt-icon" />
        {$page.data.t.home.watch}
      {:else if $page.url.pathname.includes('shows')}
        <a href="/" class="mr-1">
          <span class="i-iconamoon-arrow-left-1 my-1" /></a>
        <span class="i-logos-youtube-icon text-125% mr-1 view-transition-yt-icon" />
        {$page.data.t.home.watch}
      {:else if $page.url.pathname.includes('vocabulary')}
        <a href="/" class="mr-1">
          <span class="i-iconamoon-arrow-left-1 my-1" /></a>
        {$page.data.t.home.my_words}
      {:else}
        <a href="/">{$page.data.t.layout.tutor}</a>
      {/if}
    </div>
    <div class="grow-1" />
    {#if browser}
      <ShowHide let:show let:toggle>
        <button aria-label="Select Language" type="button" on:click={toggle}><span class="i-heroicons-language-20-solid"></span></button>
        {#if show}
          <SelectLanguage close={toggle} />
        {/if}
      </ShowHide>
      <!-- <span class="i-ri-sun-line dark:i-ri-moon-line" /> -->
      <User user={data.user} sign_out={async () => {
        await data.supabase?.auth.signOut()
        invalidateAll()
      }} />
    {/if}
  </div>
{/if}

<slot />

{#await import('./ViewTransition.svelte') then { default: ViewTransition}}
  <ViewTransition />
{/await}

{#await import('$lib/client/Toasts.svelte') then { default: Toasts }}
  <Toasts />
{/await}

{#await import('$lib/client/UserInfo.svelte') then { default: UserInfo }}
  <UserInfo />
{/await}

<style>
  a, button {
    --at-apply: px-2 py-2 hover:bg-gray/20 rounded flex items-center;
  }
</style>
