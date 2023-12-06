<script lang="ts">
  import './main.css'
  import { page } from '$app/stores'
  import User from '$lib/User.svelte'
  import { ShowHide } from 'svelte-pieces'
  import SelectLanguage from '$lib/i18n/SelectLanguage.svelte'

  export let data

// function toggleColorScheme() {
  // // save 'light' or 'dark' to 'color-scheme'
  // }
</script>

<div class="flex items-center space-x-1 py-1 pl-1" data-sveltekit-preload-data="tap" title={$page.url.pathname}>
  <a href="/" class="text-lg font-semibold">{$page.data.t.layout.tutor}</a>
  <div class="grow-1"></div>
  <ShowHide let:show let:toggle>
    <button type="button" on:click={toggle}><span class="i-heroicons-language-20-solid"></span></button>
    {#if show}
      <SelectLanguage on:close={toggle} />
    {/if}
  </ShowHide>
  <!-- <button type="button" class="btn-rose" on:click={() => ({})}>
    <span class="i-ri-sun-line dark:i-ri-moon-line" />
  </button> -->
  <User user={data.user} />
</div>

<slot />

<style>
  a, button {
    --at-apply: px-2 py-1 hover:bg-gray/20 rounded;
  }
</style>
