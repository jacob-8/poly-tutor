<script lang="ts">
  import type { CEDictEntry, Section, Sentence } from '$lib/types'
  import Paragraphs from './Paragraphs.svelte'
  import { page } from '$app/stores'
  import { Button } from 'svelte-pieces'
  import type Youtube from './Youtube.svelte'
  import OpenAiUserKey from '$lib/OpenAiUserKey.svelte'

  export let entries: Record<string, CEDictEntry>
  export let content: Section
  export let email: string
  export let studySentence: (sentence: Sentence) => void
  export let transcribeCaptions: (openai_api_key: string) => Promise<void>
  export let deleteContent: () => void

  export let currentTimeMs: number
  export let setTime: (ms: number) => void
  export let playerState: YT.PlayerState
  export let youtubeComponent: Youtube

// $: captionsLength = content.paragraphs?.map(paragraph => {
  //   return paragraph.sentences?.map(sentence => sentence.text).join('\n')
  // }).join('\n\n').length
</script>

<div class="pb-20">
  {#if content}
    <pre>{JSON.stringify(content, null, 1)}</pre>
    <!-- <div class="text-xs text-gray">({captionsLength} characters)</div>
    <Paragraphs {youtubeComponent} {playerState} {entries} {setTime} {currentTimeMs} {studySentence} paragraphs={content.paragraphs} /> -->
    <Button size="sm" form="simple" color="red" onclick={deleteContent}>Delete Captions</Button>
  {:else if email}
    <div class="text-base">
      <OpenAiUserKey let:openai_api_key>
        <Button size="lg" class="mt-2" onclick={() => transcribeCaptions(openai_api_key)}>{$page.data.t.shows.get_captions} (show price)</Button>
      </OpenAiUserKey>
    </div>
  {:else}
    {$page.data.t.layout.sign_in}
  {/if}
</div>
