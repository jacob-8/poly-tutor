<script lang="ts">
  import type { Paragraph, Sentence } from '$lib/types'

  export let paragraphs: Paragraph[] = []
  export let studySentence: (sentence: Sentence) => void
</script>

{#each paragraphs as paragraph}
  {#each paragraph.sentences as sentence}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <div
      on:mouseover={() => studySentence(sentence)}
      on:click={() => studySentence(sentence)}>
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
{/each}
