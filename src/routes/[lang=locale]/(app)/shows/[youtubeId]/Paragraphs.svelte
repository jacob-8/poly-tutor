<script lang="ts">
  import type { CEDictEntry, Paragraph, Sentence } from '$lib/types'
  import { prepareSentences } from './prepareSentences'

  export let entries: Record<string, CEDictEntry>
  export let paragraphs: Paragraph[] = []
  export let studySentence: (sentence: Sentence) => void
  export let currentTimeMs: number
  export let setTime: (ms: number) => void

  $: _sentences = paragraphs.flatMap(paragraph => paragraph.sentences)
  $: preparedSentences = prepareSentences(_sentences, entries)

  let current_caption_index = 0

  $: {
    const index = find_caption_index_by_time(currentTimeMs)
    if (index > -1) {
      studySentence(preparedSentences[index])
      current_caption_index = index
    }
  }

  function find_caption_index_by_time(current_milliseconds: number) {
    return preparedSentences.findIndex(({ start_ms, end_ms }) => {
      const isAfterStart = current_milliseconds > start_ms
      const isBeforeEnd = current_milliseconds < end_ms
      return isAfterStart && isBeforeEnd
    })
  }

  $: scroll_to_caption(current_caption_index)

  function scroll_to_caption(index: number) {
    document.querySelector(`#caption_${index}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }
</script>

{#each preparedSentences as sentence, index}
  {@const active = index === current_caption_index}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <div
    id="caption_{index}"
    class="p-1 flex flex-wrap relative hover:bg-gray-100 rounded relative group"
    class:bg-gray-200={active}
    on:mouseover={() => studySentence(sentence)}
    on:click={() => setTime(sentence.start_ms)}>
    {#each sentence.words as {text, known, pronunciation}}
      <div class="flex flex-col" class:text-green-500={!known}>
        <div class="text-xs text-center text-gray h-10px group-hover:opacity-100" class:opacity-0={known}>
          {pronunciation.replace(' ', '')}
        </div>
        <div class="whitespace-nowrap">
          {text}
        </div>
      </div>
    {/each}
  </div>
{/each}
