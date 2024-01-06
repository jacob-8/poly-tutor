<script context="module" lang="ts">
  import { get, writable } from 'svelte/store'
  import { page } from '$app/stores'

  const show_auth = writable(false)
  export function open_auth() {
    show_auth.set(true)
  }

  const openai_api_key = createPersistedStore<string>('openai_api_key', '', true)
  const show_openai_key = writable(false)
  export function open_openai_api_key() {
    show_openai_key.set(true)
  }

  export function get_openai_api_key() {
    const { data: { user} } = get(page)
    if (!get(user)) return open_auth()

    const key = get(openai_api_key)
    if (key)
      return key
    open_openai_api_key()
  }
</script>

<script lang="ts">
  import { createPersistedStore } from 'svelte-pieces'
</script>

{#if $show_auth}
  {#await import('$lib/layout/Auth.svelte') then { default: Auth }}
    <Auth close={() => $show_auth = false} />
  {/await}
{/if}

{#if $show_openai_key}
  {#await import('$lib/layout/OpenAiKey.svelte') then { default: OpenAiKey }}
    <OpenAiKey key={$openai_api_key} set_key={(value) => $openai_api_key = value} close={() => $show_openai_key = false} />
  {/await}
{/if}
