<script lang="ts">
  import { WordStatus, type AnalyzedChineseWordWithEmphasis, type Settings } from '$lib/types'

  export let settings: Settings
  export let word: AnalyzedChineseWordWithEmphasis

  $: ({text, definition, neighbor_shows_definition, opposite_script, status, pronunciation, tone_change, high_view_count, common_in_this_context, improve_pronunciation_or_tone } = word)

  $: tip_length = neighbor_shows_definition ? 10 : 20
</script>

<div class="text-center inline-flex flex-col items-center">
  {#if settings.show_pronunciation}
    <div class="text-xs text-gray-600 h-4 -mb-1 border-yellow" class:border-b={tone_change}>
      <div class:large-tone-markers={status === WordStatus.tone}>
        {#if status !== WordStatus.known && status !== WordStatus.wordlist}
          {pronunciation}
        {:else}
          &nbsp;
        {/if}
      </div>
    </div>
  {/if}
  <div class="relative"
    class:text-orange-500={high_view_count}
    class:text-blue-500={common_in_this_context}
    class:text-green-500={improve_pronunciation_or_tone}
    style="font-size: {settings.font_size_em}em;">
    {text}
    {#if opposite_script}
      <div class="absolute right-0 top-1 w-1 h-1 bg-blue rounded" />
    {/if}
  </div>
  {#if settings.show_pronunciation && status === WordStatus.unknown}
    <div class="text-xs leading-none text-gray-600">
      {definition.substring(0, tip_length)}
    </div>
  {/if}
</div>

<style>
  .large-tone-markers {
    font-size: 2.5em;
    line-height: 1.25em;
  }
</style>
