<script lang="ts">
  import { page } from '$app/stores'
  import { ShowHide, Slideover, portal } from 'svelte-pieces'
  import type { BaseUser } from './supabase/user'
  import type { Readable } from 'svelte/store'

  export let user: Readable<BaseUser>
  export let signOut: () => Promise<void>
  $: email = $user?.session?.user?.email
</script>

{#if email}
  <ShowHide let:show let:toggle>
    <button class="header-btn" type="button" title={JSON.stringify($user, null, 1)} on:click={toggle}>
      <div
        class="w-34px h-34px rounded-full flex items-center justify-center font-semibold bg-gray-100 hover:bg-gray-200 uppercase"
      >
        {email[0]}
      </div>
    </button>
    {#if show}
      <div use:portal>
        <Slideover on:close={toggle}>
          <span slot="title">
            {email}
          </span>
          <button class="slideover-btn" type="button" on:click={signOut}>
            <span class="i-material-symbols-logout-rounded vertical--3px" />
            {$page.data.t.layout.sign_out}
          </button>
        </Slideover>
      </div>
    {/if}
  </ShowHide>
{:else}
  <ShowHide let:show let:toggle>
    <button class="header-btn" type="button" on:click={toggle}>
      <span class="i-material-symbols-login-rounded vertical--2px" />
      <span class="hidden sm:inline">{$page.data.t.layout.sign_in}</span>
    </button>
    {#if show}
      {#await import('$lib/Auth.svelte') then { default: Auth }}
        <Auth on:close={toggle} />
      {/await}
    {/if}
  </ShowHide>
{/if}


<style>
  .slideover-btn {
    --at-apply: px-3 py-2 hover:bg-gray/20 w-full text-left;
  }
</style>
