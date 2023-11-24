<script lang="ts">
  import type { Sentence } from '$lib/types'

  export let sentence: Sentence
  export let onmouseenter: () => void
  export let onmouseleave: () => void
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="opacity-10 hover:opacity-100" on:mouseenter={onmouseenter} on:mouseleave={onmouseleave}>
  <div class="text-xl">
    {#each sentence.syntax.tokens as { text: {content} }}
      {content}
    {/each}
  </div>
  {#if sentence.machine_translation}
    {sentence.machine_translation?.en}
  {/if}
  <div class="mt-3"></div>

  {#if sentence.syntax}
    <table>
      {#each sentence.syntax.tokens as { text: {content}, partOfSpeech: {tag} }}
        <tr>
          <td>{content}</td>
          <td class="text-xs">{tag}</td>
          <td>definition</td>
        </tr>
      {/each}
    </table>
  {/if}
</div>
