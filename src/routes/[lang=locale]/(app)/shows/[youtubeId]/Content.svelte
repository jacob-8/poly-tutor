<script lang="ts">
  import type { CEDictEntry, Content, Sentence } from '$lib/types'
  import Paragraphs from './Paragraphs.svelte'
  import { page } from '$app/stores'
  import { Button } from 'svelte-pieces'
  import type Youtube from './Youtube.svelte'

  export let entries: Record<string, CEDictEntry>
  export let content: Content
  export let email: string
  export let studySentence: (sentence: Sentence) => void
  export let getCaptions: () => Promise<void>
  export let deleteContent: () => void

  export let currentTimeMs: number
  export let setTime: (ms: number) => void
  export let playerState: YT.PlayerState
  export let youtubeComponent: Youtube

  $: captionsLength = content.paragraphs?.map(paragraph => {
    return paragraph.sentences?.map(sentence => sentence.text).join('\n')
  }).join('\n\n').length
</script>

<div>
  {#if content.paragraphs}
    <div class="text-xs text-gray">({captionsLength} characters)</div>
    <Paragraphs {youtubeComponent} {playerState} {entries} {setTime} {currentTimeMs} {studySentence} paragraphs={content.paragraphs} />
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
