<script lang="ts">
  import { WordStatus, type AnalyzedEnglishWord, type Settings, type StudyWordsObject, type UserVocabulary } from '$lib/types'

  export let settings: Settings
  export let word: AnalyzedEnglishWord
  export let study_words_object: StudyWordsObject
  export let changed_words: UserVocabulary = {}

  $: ({text, inflected, definitions, neighbors_understood, status: db_status, phonetic } = word)
  $: status = changed_words?.[text]?.status ?? db_status
</script>

<div class="text-center inline-block mt-2 mr-1">
  {#if settings.show_pronunciation}
    <div class="flex">
      <div class="grow-1 w-0 text-xs text-gray-500/80 h-2">
        {#if !(status > WordStatus.unknown)}
          {phonetic || ''}
        {/if}
      </div>
    </div>
  {/if}
  <div class:text-orange-500={study_words_object?.high_view_count[text]}
    class:text-blue-500={study_words_object?.common_in_this_context[text]}
    style="font-size: {settings.font_size_em}em;">
    {inflected || text}
  </div>
  {#if settings.show_definition && definitions && !(status > WordStatus.unknown)}
    <div class="flex">
      <div class="grow-1 w-0 text-0.8em text-gray-500/80 overflow-hidden h-5" class:-mx-2.75={neighbors_understood}>
        {definitions?.replace(/^.*\./, '').substring(0, 20)}
      </div>
    </div>
  {/if}
</div>
