<script lang="ts">
  import type { Paragraph, Sentence } from '$lib/types'

  export let paragraphs: Paragraph[] = []
  export let studySentence: (sentence: Sentence) => void
  export let currentTimeMs: number
  export let setTime: (ms: number) => void

  $: sentences = paragraphs.flatMap(paragraph => paragraph.sentences)

  let current_caption_index = 0

  $: {
    const index = find_caption_index_by_time(currentTimeMs)
    if (index > -1)
      current_caption_index = index
  }

  function find_caption_index_by_time(current_milliseconds: number) {
    return sentences.findIndex(({ start_ms, end_ms }) => {
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

{#each sentences as sentence, index}
  {@const active = index === current_caption_index}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <div
    id="caption_{index}"
    class="p-1 flex flex-wrap relative hover:bg-gray-100 rounded relative"
    class:bg-gray-200={active}
    on:mouseover={() => studySentence(sentence)}
    on:click={() => setTime(sentence.start_ms)}>
    {#if sentence.syntax?.tokens?.length}
      {#each sentence.syntax.tokens as {text}}
        {text.content}
      {/each}
    {:else if sentence.words}
      {#each sentence.words as word}
        {word.text}
      {/each}
    {:else}
      {sentence.text}
    {/if}
  </div>
{/each}
