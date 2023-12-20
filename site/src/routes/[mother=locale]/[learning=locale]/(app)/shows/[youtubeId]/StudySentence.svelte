<script lang="ts">
  import { page } from '$app/stores'
  import type { CEDictEntry, Sentence } from '$lib/types'

  export let entries: Record<string, CEDictEntry> = {}
  export let sentence: Sentence
  export let onmouseenter: () => void
  export let onmouseleave: () => void
  export let playing = false

  $: knownWords = sentence.words?.filter(({ known, language }) => known && language === 'zh') || []
  $: unKnownWords = sentence.words?.filter(({ known }) => !known) || []
</script>

<!-- on:mouseenter={onmouseenter} on:mouseleave={onmouseleave} -->
<div class:opacity-15={playing} class="h-full">
  <div class="text-xl">
    {#if sentence.words}
      {#each sentence.words as { text }}
        {text}
      {/each}
    {:else}
      {sentence.text}
    {/if}
  </div>
  {#if sentence.translation}
    {sentence.translation[$page.data.mother]}
  {/if}
  <div class="border-b border-gray-300 pb-2 mb-2"></div>

  <table class="border-b border-gray-300 pb-2 mb-2 w-full">
    {#each unKnownWords as { text, partOfSpeechTag }}
      <tr>
        <td class="v-top text-xl whitespace-nowrap text-green-500">{text}</td>
        <td class="v-top pb-4">{entries[text]?.definitionsArray.join(', ') || ''}
          {#if partOfSpeechTag}
            <span class="text-sm text-gray">({partOfSpeechTag})</span>
          {/if}
        </td>
      </tr>
    {/each}
  </table>

  <table>
    {#each knownWords as { text, partOfSpeechTag }}
      <tr>
        <td class="v-top text-xl whitespace-nowrap">{text}</td>
        <td class="v-top pb-4">{entries[text]?.definitionsArray.join(', ') || ''}
          {#if partOfSpeechTag}
            <span class="text-sm text-gray">({partOfSpeechTag})</span>
          {/if}
        </td>
      </tr>
    {/each}
  </table>
</div>
