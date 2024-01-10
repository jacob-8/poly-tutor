<script lang="ts">
  import { page } from '$app/stores'
  import { WordStatus, type AnalyzedChineseWord } from '$lib/types'
  import { sort_definitions } from '$lib/utils/sort-definitions'

  export let word: AnalyzedChineseWord
  export let high_view_count = false
  export let common_in_this_context = false
  export let improve_pronunciation_or_tone = false
  export let change_word_status: (word: string, status: WordStatus) => void


  $: ({text, definitions, pinyin, status: db_status } = word)

  $: ({changed_words} = $page.data.user_vocabulary)
  $: status = $changed_words[text]?.status ?? db_status

  function on_change_status(clicked_status: WordStatus) {
    if (status === clicked_status)
      change_word_status(text, WordStatus.unknown)
    else
      change_word_status(text, clicked_status)
  }
</script>

{#if pinyin}
  <div class="flex mb-3 items-start">
    <div class="flex flex-col mr-2">
      <div class="text-nowrap text-xl"
        class:text-orange-500={high_view_count}
        class:text-blue-500={common_in_this_context}
        class:text-green-500={improve_pronunciation_or_tone}>
        {text}
      </div>
      <div class="text-nowrap text-sm">{pinyin.replaceAll(' ', '')}</div>
    </div>

    <div class="text-xs">
      {sort_definitions(definitions).join(', ') || ''}
    </div>

    <div class="ml-auto mr-1"></div>
    <button type="button" on:click={() => on_change_status(WordStatus.pronunciation)} class:active={status === WordStatus.pronunciation}><span class="i-material-symbols-hearing" /></button>
    <button type="button" on:click={() => on_change_status(WordStatus.tone)} class:active={status === WordStatus.tone}><span class="text-4xl -mb-4.5">ˊ</span></button>
    <button type="button" on:click={() => on_change_status(WordStatus.known)} class:active={status === WordStatus.known}><span class="i-material-symbols-check-small-rounded text-xl" /></button>
  </div>
{/if}

<style>
  button {
    --at-apply: flex items-center justify-center h-9 w-9 shrink-0 hover:bg-gray/30 rounded border border-transparent;
  }
  .active {
    --at-apply: border-green-600 text-green-600;
  }
</style>
