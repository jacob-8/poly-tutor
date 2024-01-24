<script lang="ts">
  import { WordStatus, type AnalyzedChineseWord, type Settings, type StudyWordsObject, type UserVocabulary } from '$lib/types'
  import { sort_definitions } from '$lib/utils/sort-definitions'
  import { get_status_pronunciation } from './get-status-pronunciation'

  export let settings: Settings
  export let word: AnalyzedChineseWord
  export let study_words_object: StudyWordsObject
  export let changed_words: UserVocabulary = {}

  $: ({text, definitions, neighbors_understood, status: db_status, pinyin, tone_change } = word)

  $: status = changed_words?.[text]?.status ?? db_status
</script>

<div class="text-center inline-flex flex-col items-center mt-2">
  {#if settings.show_pronunciation}
    <div class="text-xs text-gray-500/80 h-4 -mb-1 border-yellow" class:border-b={tone_change}>
      <div class:large-tone-markers={status === WordStatus.tone}>
        {get_status_pronunciation(pinyin, status)}
      </div>
    </div>
  {/if}
  <div class="relative"
    class:text-orange-500={study_words_object?.high_view_count[text]}
    class:text-blue-500={study_words_object?.common_in_this_context[text]}
    class:text-green-500={study_words_object?.improve_pronunciation_or_tone[text]}
    style="font-size: {settings.font_size_em}em;">
    {text}
    <!-- {#if opposite_script}
      <div class="absolute right-0 top-1 w-1 h-1 bg-blue rounded" />
    {/if} -->
  </div>
  {#if settings.show_definition && status === WordStatus.unknown}
    <div class="text-base" style="max-width: {settings.font_size_em * text.length}em;">
      <div class="text-0.6em leading-none text-gray-500/80 overflow-hidden max-h-2em" class:-mx-2.75={neighbors_understood}>
        {sort_definitions(definitions).join(', ').substring(0, 40)}
      </div>
    </div>
  {/if}
</div>

<style>
  .large-tone-markers {
    font-size: 2.5em;
    line-height: 1.25em;
  }
</style>
