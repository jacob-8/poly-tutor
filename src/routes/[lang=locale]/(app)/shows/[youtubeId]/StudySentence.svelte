<script lang="ts">
  import type { CEDictEntry, Sentence } from '$lib/types'

  export let entries: Record<string, CEDictEntry> = {}
  export let sentence: Sentence
  export let onmouseenter: () => void
  export let onmouseleave: () => void

  function is中文(text: string): boolean {
    const 中文 = /[\u4E00-\u9FA5]+/
    return 中文.test(text)
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="opacity-100 hover:opacity-100" on:mouseenter={onmouseenter} on:mouseleave={onmouseleave}>
  <div class="text-xl">
    {#each sentence.syntax.tokens as { text: {content} }}
      {content}
    {/each}
  </div>
  {#if sentence.machine_translation}
    {sentence.machine_translation?.en}
  {/if}
  <div class="border-b border-gray-300 pb-2 mb-2"></div>

  {#if sentence.syntax}
    <table>
      {#each sentence.syntax.tokens as { text: {content}, partOfSpeech: {tag} }}
        {#if is中文(content)}
          <tr>
            <td class="v-top text-xl whitespace-nowrap">{content}</td>
            <td class="v-top pb-4">{entries[content]?.definitionsArray.join(', ') || ''} <span class="text-sm text-gray">({tag})</span></td>
          </tr>
        {/if}
      {/each}
    </table>
  {/if}
</div>
