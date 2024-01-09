<script lang="ts">
  import type { Sentence, Settings, StudyWordsObject } from '$lib/types'
  import ChineseWord from '$lib/components/ChineseWord.svelte'
  import { IntersectionObserverShared } from 'svelte-pieces'

  export let onClick: () => void = undefined
  export let id: string = undefined
  export let active = false
  export let sentence: Sentence
  export let settings: Settings
  export let study_words_object: StudyWordsObject
</script>

<IntersectionObserverShared bottom={1000} top={1000} once let:intersecting>
  <div
    {id}
    class="px-1 pb-3 flex flex-wrap relative hover:bg-gray-100 rounded relative group"
    class:bg-gray-200={active}
    on:click={onClick}>
    {#if intersecting}
      {#if sentence.words}
        {#each sentence.words as word}
          <ChineseWord {study_words_object} {word} {settings} />
        {/each}
      {:else}
        <div>{sentence.text}</div>
      {/if}
    {/if}
  </div>
</IntersectionObserverShared>
