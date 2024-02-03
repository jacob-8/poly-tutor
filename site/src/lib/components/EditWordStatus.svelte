<script lang="ts">
  import { WordStatus, type AnalyzedChineseWord, type UserVocabulary } from '$lib/types'
  import { find_tone, tone_marker } from '$lib/utils/find-tone'
  import { sort_definitions } from '$lib/utils/sort-definitions'
  import { get_status_pronunciation } from './get-status-pronunciation'

  export let word: AnalyzedChineseWord
  export let high_view_count = false
  export let common_in_this_context = false
  export let improve_pronunciation_or_tone = false
  export let change_word_status: (word: string, status: WordStatus) => void
  export let changed_words: UserVocabulary = {}

  $: ({text, definitions, pinyin, status: db_status, views, context_sentence_indexes } = word)
  $: status = changed_words?.[text]?.status ?? db_status

  function on_change_status(clicked_status: WordStatus) {
    if (status === clicked_status)
      change_word_status(text, WordStatus.unknown)
    else
      change_word_status(text, clicked_status)
  }
</script>

<div class="flex mb-3 items-start">
  <div class="flex flex-col mr-2" class:text-center={status === WordStatus.tone}>
    {#if pinyin}
      <div class="text-xs h-4 -mb-.5"
        class:text-gray-500:80={status > WordStatus.pronunciation}
        class:large-tone-markers={status === WordStatus.tone}>
        {get_status_pronunciation(pinyin, status)}
      </div>
    {/if}

    <div class="text-nowrap text-xl"
      class:text-orange-500={high_view_count}
      class:text-blue-500={common_in_this_context}
      class:text-green-500={improve_pronunciation_or_tone}>
      {text}
    </div>
  </div>

  <div class="text-xs" class:text-gray-500={status > WordStatus.unknown}>
    {sort_definitions(definitions).join(', ') || ''}

    <span class="ml-1 bg-gray-700/80 rounded py-.5 px-1 text-white">
      {#if common_in_this_context && context_sentence_indexes}
        {context_sentence_indexes.length}
      {:else}
        {views}
      {/if}
    </span>

    {#if /Mobi|Android|iPad|iPhone|iPod/i.test(navigator.userAgent)}
      <a class="text-blue" href={`plecoapi://x-callback-url/s?q=${text}`}>
        PLECO
      </a>
      <div class="mr-1" />
    {/if}
  </div>

  <div class="ml-auto mr-1"></div>
  {#if pinyin}
    <button type="button" class="text-xs" on:click={() => on_change_status(WordStatus.pronunciation)} class:active={status === WordStatus.pronunciation}>{pinyin.split(' ').splice(0, 1)}</button>
    <button type="button" on:click={() => on_change_status(WordStatus.tone)} class:active={status === WordStatus.tone}><span class="text-4xl -mb-4.5">{pinyin.split(' ').splice(0,2).map(find_tone).map(tone_marker).join('')}</span></button>
  {/if}
  <button type="button" on:click={() => on_change_status(WordStatus.known)} class:active={status === WordStatus.known}><span class:i-bi-hand-thumbs-up-fill={status === WordStatus.known} class="i-bi-hand-thumbs-up text-xl" /></button>
</div>

<style>
  button {
    --at-apply: flex items-center justify-center h-9 w-9 shrink-0 hover:bg-gray/30 rounded border border-transparent;
  }
  .active {
    --at-apply: border-green-600 text-green-600;
  }
  .large-tone-markers {
    font-size: 2.5em;
    line-height: 1.1em;
  }
</style>
