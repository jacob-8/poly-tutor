<script lang="ts">
  import { page } from '$app/stores'
  import type { Sentence } from '$lib/types'
  import { Button } from 'svelte-pieces'
  import OpenAiUserKey from '$lib/OpenAiUserKey.svelte'

  export let addSummary: (key: string) => Promise<void>
  export let deleteSummary: () => void
  export let sentences: Sentence[]
  export let studySentence: (sentence: Sentence) => void
</script>

<div class="border-b pb-2 my-2">
  <div class="text-xs text-gray mb-2">
    {$page.data.t.shows.summary}
  </div>
  {#if sentences?.length}
    {#each sentences as sentence}
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
    <Button size="sm" form="simple" color="red" onclick={deleteSummary}>Delete Summary</Button>
  {:else}
    <div class="text-base">
      <OpenAiUserKey let:openai_api_key>
        <Button onclick={() => addSummary(openai_api_key)}>{$page.data.t.shows.summarize}</Button>
      </OpenAiUserKey>
    </div>
  {/if}
</div>


