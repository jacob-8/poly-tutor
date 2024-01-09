<script lang="ts">
  import { page } from '$app/stores'
  import { open_openai_api_key } from '$lib/client/UserInfo.svelte'
  export let sign_out: () => Promise<void>
</script>

<button type="button" on:click={open_openai_api_key}>
  <span class="i-simple-icons-openai vertical--3px" /> OpenAI Api Key
</button>

<button type="button" on:click={sign_out}>
  <span class="i-material-symbols-logout-rounded vertical--3px" />
  {$page.data.t.layout.sign_out}
</button>

<style>
  button {
    --at-apply: px-3 py-2 hover:bg-gray/20 w-full text-left;
  }
</style>
