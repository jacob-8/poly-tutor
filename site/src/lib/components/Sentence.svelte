<script lang="ts">
  import type { Sentence, Settings, StudyWordsObject, UserVocabulary } from '$lib/types'
  import ChineseWord from '$lib/components/ChineseWord.svelte'
  import { IntersectionObserverShared } from 'svelte-pieces'
  import ImSeen from './ImSeen.svelte'
  import type { LanguageCode } from '$lib/i18n/locales'

  export let language: LanguageCode
  export let onClick: () => void = undefined
  export let id: string = undefined
  export let active = false
  export let sentence: Sentence
  export let settings: Settings
  export let study_words_object: StudyWordsObject
  export let add_seen_sentence: (words: string[]) => void = undefined
  export let mark_seen_based_on_visibility = false
  export let changed_words: UserVocabulary = {}

  let has_been_seen = false

  $: if (add_seen_sentence && active)
    i_am_seen()

  function i_am_seen() {
    if (has_been_seen || !sentence.words) return
    add_seen_sentence(sentence.words
      .filter(({definitions}) => definitions?.length > 0)
      .map(({text}) => text))
    has_been_seen = true
  }
</script>

<IntersectionObserverShared bottom={1000} top={1000} once let:intersecting>
  <div
    {id}
    class="px-1 pb-3 flex flex-wrap relative hover:bg-gray-100 rounded relative group"
    class:bg-gray-200={active}
    on:mousedown={onClick}
    on:touchstart={onClick}>
    {#if intersecting}
      {#if sentence.words}
        {#if mark_seen_based_on_visibility && add_seen_sentence && !has_been_seen}
          <ImSeen {i_am_seen} milliseconds={6000} />
        {/if}
        {#each sentence.words as word}
          {#if language === 'zh'}
            <ChineseWord {changed_words} {study_words_object} {word} {settings} />
          {:else}
            <div class="mr-1">{word.text}</div>
          {/if}
        {/each}
      {:else}
        <div>{sentence.text}</div>
      {/if}
    {/if}
  </div>
</IntersectionObserverShared>
