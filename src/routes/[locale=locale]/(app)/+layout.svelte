<script lang="ts">
  import './main.css'
  import { page } from '$app/stores'
  import User from '$lib/User.svelte'
  import { changeLocale } from '$lib/i18n/changeLocale'

  export let data

// function toggleColorScheme() {
  // // save 'light' or 'dark' to 'color-scheme'
  // }
</script>

<div class="flex items-center space-x-1 py-1 pl-1" data-sveltekit-preload-data="tap" title={$page.url.pathname}>
  <a href="/{$page.data.locale}/shows" class="text-lg font-semibold">{$page.data.t.layout.tutor}</a>
  <div class="grow-1"></div>
  <button type="button" on:click={() => changeLocale('en')} class:text-blue={$page.data.locale === 'en'}>EN</button>
  <button type="button" on:click={() => changeLocale('zh-TW')} class:text-blue={$page.data.locale === 'zh-TW'}>繁體</button>
  <button type="button" on:click={() => changeLocale('zh-CN')} class:text-blue={$page.data.locale === 'zh-CN'}>简体</button>
  <!-- <button type="button" class="btn-rose" on:click={() => ({})}>
    <span class="i-ri-sun-line dark:i-ri-moon-line" />
  </button> -->
  <User user={data.user} />
</div>

<slot />

<style>
  a, button {
    --at-apply: px-2 py-1 hover:bg-gray-100 rounded;
  }
</style>
