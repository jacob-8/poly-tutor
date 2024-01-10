<script lang="ts">
  import { page } from '$app/stores'
  import { ShowHide, Slideover, portal } from 'svelte-pieces'
  import type { BaseUser } from '$lib/supabase/user'
  import type { Readable } from 'svelte/store'
  import SideMenuContent from './SideMenuContent.svelte'

  export let user: Readable<BaseUser>
  export let sign_out: () => Promise<void>
</script>

{#if $user}
  <ShowHide let:show let:toggle>
    <button class="header-btn" type="button" title={JSON.stringify($user, null, 1)} on:click={toggle}>
      <div
        class="w-34px h-34px rounded-full flex items-center justify-center font-semibold bg-gray-100 hover:bg-gray-200 uppercase"
      >
        {$user.email[0]}
      </div>
    </button>
    {#if show}
      <div use:portal>
        <Slideover on:close={toggle}>
          <span slot="title">
            {$user.email}
          </span>
          <SideMenuContent {sign_out} />
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
      {#await import('$lib/layout/Auth.svelte') then { default: Auth }}
        <Auth close={toggle} />
      {/await}
    {/if}
  </ShowHide>
{/if}



