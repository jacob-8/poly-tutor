<script lang="ts">
  import { WordStatus, type Sentence, type AnalyzedChineseWord } from '$lib/types'
  import { sort_definitions } from '$lib/utils/sort-definitions'

  export let sentence: Sentence
  export let black = false // for kitbook mocking only

  function sortByOriginalIndex(a: AnalyzedChineseWord, b: AnalyzedChineseWord) {
    return sentence.words.indexOf(a) - sentence.words.indexOf(b)
  }

  $: words = sentence.words
    .filter(word => word.status === WordStatus.unknown)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3)
    .sort(sortByOriginalIndex) as AnalyzedChineseWord[]
</script>

{#if black}
  <div class="bg-black h-250px w-full" />
{/if}

<div class="absolute top-.5 left-0 z-1 text-white stroke">
  {#each words as word}
    <div class="px-1">
      {word.pinyin?.replaceAll(' ', '')}
    </div>
    <div class="flex items-center">
      <div class="text-lg px-1">
        {word.text}
      </div>
      <div class="px-.5 text-0.7em max-w-40vw sm:max-w-150px overflow-hidden max-h-2.1em leading-none">
        {sort_definitions(word.definitions).join(', ')}
      </div>
    </div>
  {/each}
</div>

<style>
  .stroke {
  text-shadow:
  1px 1px 2px #000,
    -1px 1px 2px #000,
    -1px -1px 2px #000,
    1px -1px 2px #000;
  }
</style>
