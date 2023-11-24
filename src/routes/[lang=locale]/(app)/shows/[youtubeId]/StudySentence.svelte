<script lang="ts">
  import type { Sentence } from '$lib/types'

  export let sentence: Sentence
</script>

{#if sentence.machine_translation}
  {sentence.machine_translation?.en}
{/if}

{#if sentence.syntax}
  <div class="flex flex-wrap">
    {#each sentence.syntax.tokens as { text: {content}, partOfSpeech: {tag} }}
      <div class="flex flex-col items-center pr-2">
        <div>{content}</div>
        <div class="text-xs">{tag}</div>
      </div>
    {/each}
  </div>
{/if}
