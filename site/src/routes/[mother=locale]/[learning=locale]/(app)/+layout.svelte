<script lang="ts">
  import './main.css'
  import { page } from '$app/stores'
  import User from '$lib/layout/User.svelte'
  import { ShowHide } from 'svelte-pieces'
  import SelectLanguage from '$lib/i18n/SelectLanguage.svelte'
  import { invalidateAll } from '$app/navigation'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'

  export let data

  onMount(async () => {
    const { api } = await import('$lib/analysis/expose-analysis-worker')
    const result = await api.segment('你好世界！')
    console.info(result)
  })
</script>

<div class="flex items-center space-x-1 py-1 pl-1" data-sveltekit-preload-data="tap">
  <div class="text-lg font-semibold flex items-center truncate">
    {#if $page.data.youtube}
      <a aria-label="Back Button" href="../shows"><span class="i-iconamoon-arrow-left-1 mr-1" /></a>
      {$page.data.youtube.title}
    {:else if $page.url.pathname.includes('shows')}
      <a href="/">
        <span class="i-iconamoon-arrow-left-1 mr-1" /></a>
      {$page.data.t.home.watch}
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
