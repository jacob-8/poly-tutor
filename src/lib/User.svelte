<script lang="ts">
  import { page } from '$app/stores'
  import { ShowHide } from 'svelte-pieces'
  import type { BaseUser } from './supabase/user'
  import type { Readable } from 'svelte/store'

  export let user: Readable<BaseUser>
  $: console.info({user: $user?.session?.user?.email})
</script>

<!-- {$user.session?.user.email} -->
{#if $user}
  <button type="button" title={JSON.stringify($user, null, 1)} on:click={async () => await $page.data.supabase?.auth.signOut()}>{$page.data.t.layout.sign_out}</button>
{:else}
  <ShowHide let:show let:toggle>
    <button type="button" on:click={toggle}>{$page.data.t.layout.sign_in}</button>
    {#if show}
      {#await import('$lib/Auth.svelte') then { default: Auth }}
        <Auth on:close={toggle} />
      {/await}
    {/if}
  </ShowHide>
{/if}


<style>
  button {
    --at-apply: px-2 py-1 hover:bg-gray-100 rounded;
  }
</style>
