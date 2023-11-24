<script lang="ts">
  import type { Content, Sentence } from '$lib/types'
  import Paragraphs from './Paragraphs.svelte'
  import { page } from '$app/stores'
  import { Button } from 'svelte-pieces'

  export let content: Content
  export let email: string
  export let studySentence: (sentence: Sentence) => void
  export let getCaptions: () => Promise<void>
  export let getSummary: () => Promise<void>
  export let deleteContent: () => void
  export let deleteSummary: () => void

  $: captionsLength = content.paragraphs?.map(paragraph => {
    return paragraph.sentences?.map(sentence => sentence.text).join('\n')
  }).join('\n\n').length
</script>

{#if content.paragraphs}
  <div class="border-b pb-2 mb-2">
    <div class="text-xs text-gray mb-2">
      {$page.data.t.shows.summary}
    </div>
    {#if content.summary}
      <Paragraphs {studySentence} paragraphs={content.summary} />
      <Button size="sm" form="simple" color="red" onclick={deleteSummary}>delete</Button>
    {:else}
      <Button onclick={getSummary}>{$page.data.t.shows.summarize}</Button>
    {/if}
  </div>
{/if}
<div>
  {#if content.paragraphs}
    <div class="text-xs text-gray">({captionsLength} characters)</div>
    <Paragraphs {studySentence} paragraphs={content.paragraphs} />
    <Button size="sm" form="simple" color="red" onclick={deleteContent}>Delete All</Button>
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
