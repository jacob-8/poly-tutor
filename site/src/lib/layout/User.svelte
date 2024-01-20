<script lang="ts">
  import { browser } from '$app/environment'
  import { page } from '$app/stores'
  import { ShowHide, Slideover, portal } from 'svelte-pieces'
  import type { BaseUser } from '$lib/supabase/user'
  import type { Readable } from 'svelte/store'
  import SideMenuContent from './SideMenuContent.svelte'
  import GoogleOneTap from './GoogleOneTap.svelte'

  export let user: Readable<BaseUser>
  export let sign_out: () => Promise<void>

  const started_signed_out = !$user

  $: name = $user?.user_metadata?.full_name || $user?.email
  let broken_avatar_image = false

  $: can_google_authenticate = browser && !location.origin.includes('vercel.app')
</script>

{#if $user}
  <ShowHide let:show let:toggle>
    <button class="header-btn" type="button" title={JSON.stringify($user, null, 1)} on:click={toggle}>

      {#if $user.user_metadata.avatar_url && !broken_avatar_image}
        <img
          class="w-34px h-34px rounded-full"
          alt={name[0]}
          src={$user.user_metadata.avatar_url}
          on:error={() => broken_avatar_image = true}
        />
      {:else}
        <div
          class="w-34px h-34px rounded-full flex items-center justify-center font-semibold bg-gray-100 hover:bg-gray-200 uppercase"
        >
          {name[0]}
        </div>
      {/if}

    </button>
    {#if show}
      <div use:portal>
        <Slideover on:close={toggle}>
          <span slot="title">
            {$user.user_metadata?.full_name || $user.email}
            {#if $user.user_metadata?.full_name}
              <div class="text-xs font-normal">
                {$user.email}
              </div>
            {/if}
          </span>
          <SideMenuContent {sign_out} />
        </Slideover>
      </div>
    {/if}
  </ShowHide>
{:else}
  <ShowHide let:show let:toggle>
    <button class="header-btn" type="button" on:click={toggle}>
      <span class="i-material-symbols-login-rounded vertical--2px mr-1" />
      <span class="hidden sm:inline">{$page.data.t.layout.sign_in}</span>
    </button>
    {#if show}
      {#await import('$lib/layout/Auth.svelte') then { default: Auth }}
        <Auth close={toggle} />
      {/await}
    {/if}
  </ShowHide>
{/if}

{#if can_google_authenticate && started_signed_out && $page.data.supabase}
  <GoogleOneTap />
{/if}
