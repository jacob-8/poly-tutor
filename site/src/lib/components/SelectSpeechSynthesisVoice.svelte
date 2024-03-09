<script lang="ts">
  import { page } from '$app/stores'
  import type { LocaleCode } from '$lib/i18n/locales'
  import { current_voices, get_voices, set_preferred_voice } from '$lib/utils/speak'

  export let locale: LocaleCode

  function handle_voice_change(event) {
    set_preferred_voice(locale, event.target.value)
  }
</script>

{#if $current_voices?.[locale]}
  <div class="flex flex-col sm:flex-row sm:items-center mb-3">
    <div class="mr-1 text-nowrap">
      {$page.data.t.shows.mother_tongue_voice}:
    </div>
    <select on:change={handle_voice_change} class="py-1 px-2 border border-gray rounded w-full">
      {#each get_voices() as voice}
        <option value={voice.name} selected={voice.name === $current_voices[locale].name}>{voice.name} ({voice.lang})</option>
      {/each}
    </select>
  </div>
{/if}
