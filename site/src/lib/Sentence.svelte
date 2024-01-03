<script lang="ts">
  import type { Sentence } from './types'
  import ChineseWord from '$lib/analysis/ChineseWord.svelte'
  import { IntersectionObserverShared } from 'svelte-pieces'

  export let onClick: () => void = undefined
  export let onMouseover: () => void = undefined
  export let id: string = undefined
  export let active = false
  export let sentence: Sentence
</script>

<IntersectionObserverShared bottom={1000} top={1000} once let:intersecting>
  <div
    {id}
    class="px-1 pb-3 flex flex-wrap relative hover:bg-gray-100 rounded relative group"
    class:bg-gray-200={active}
    on:mouseover={onMouseover}
    on:click={onClick}>
    {#if intersecting}
      {#if sentence.words}
        {#each sentence.words as word}
          <ChineseWord {word} settings={{font_size_em: 1.75, show_definition: true, show_pronunciation: true}} />
        {/each}
      {:else}
        <div>{sentence.text}</div>
      {/if}
    {/if}
  </div>
</IntersectionObserverShared>
