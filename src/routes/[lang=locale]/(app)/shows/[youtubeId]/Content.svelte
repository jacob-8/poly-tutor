<script lang="ts">
  import type { CEDictEntry, Content, Sentence } from '$lib/types'
  import Paragraphs from './Paragraphs.svelte'
  import Summary from './Summary.svelte'
  import { page } from '$app/stores'
  import { Button } from 'svelte-pieces'

  export let entries: Record<string, CEDictEntry>
  export let content: Content
  export let summary: Content
  export let email: string
  export let studySentence: (sentence: Sentence) => void
  export let getCaptions: () => Promise<void>
  export let getSummary: () => Promise<void>
  export let deleteContent: () => void
  export let deleteSummary: () => void

  export let currentTimeMs: number
  export let setTime: (ms: number) => void

  $: captionsLength = content.paragraphs?.map(paragraph => {
    return paragraph.sentences?.map(sentence => sentence.text).join('\n')
  }).join('\n\n').length
</script>

{#if content.paragraphs}
  <div class="border-b pb-2 my-2">
    <div class="text-xs text-gray mb-2">
      {$page.data.t.shows.summary}
    </div>
    {#if summary.summary}
      <Summary {studySentence} paragraphs={summary.summary} />
      <Button size="sm" form="simple" color="red" onclick={deleteSummary}>Delete Summary</Button>
    {:else}
      <Button onclick={getSummary}>{$page.data.t.shows.summarize}</Button>
    {/if}
  </div>
{/if}

<div>
  {#if content.paragraphs}
    <div class="text-xs text-gray">({captionsLength} characters)</div>
    <Paragraphs {entries} {setTime} {currentTimeMs} {studySentence} paragraphs={content.paragraphs} />
    <Button size="sm" form="simple" color="red" onclick={deleteContent}>Delete Captions</Button>
  {:else if email}
    {#if email === 'jacob@polylingual.dev'}
      <Button size="sm" onclick={getCaptions}>{$page.data.t.shows.get_captions}</Button>
    {:else}
      Sorry, the tool is not ready yet. Thank you for your interest. I will use your email address to notify you when it is ready.
    {/if}
  {:else}
    {$page.data.t.layout.sign_in}
  {/if}
</div>
