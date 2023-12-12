<script lang="ts">
  import './main.css'
  import { page } from '$app/stores'
  import User from '$lib/User.svelte'
  import { ShowHide } from 'svelte-pieces'
  import SelectLanguage from '$lib/i18n/SelectLanguage.svelte'
  import { invalidateAll, onNavigate } from '$app/navigation'

  export let data

  onNavigate((navigation) => {
    if (!document.startViewTransition) return

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })
</script>

<div class="flex items-center space-x-1 py-1 pl-1" data-sveltekit-preload-data="tap">
  <div class="text-lg font-semibold flex items-center truncate">
    {#if $page.data.youtube}
      <a href="../shows">
        <span class="i-iconamoon-arrow-left-1 mr-1" /></a>
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
  <ShowHide let:show let:toggle>
    <button type="button" on:click={toggle}><span class="i-heroicons-language-20-solid"></span></button>
    {#if show}
      <SelectLanguage on:close={toggle} />
    {/if}
  </ShowHide>
  <!-- <span class="i-ri-sun-line dark:i-ri-moon-line" /> -->
  <User user={data.user} signOut={async () => {
    await data.supabase?.auth.signOut()
    invalidateAll()
  }} />
</div>

<slot />

<style>
  a, button {
    --at-apply: px-2 py-2 hover:bg-gray/20 rounded flex items-center;
  }

  :root::view-transition-old(root), :root::view-transition-new(root) {
    animation-duration: 0s;
  }
</style>
