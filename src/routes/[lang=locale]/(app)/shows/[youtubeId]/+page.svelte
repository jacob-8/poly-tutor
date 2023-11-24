<script lang="ts">
  import { page } from '$app/stores'
  import Youtube from './Youtube.svelte'
  import Paragraphs from './Paragraphs.svelte'
  import type { Sentence } from '$lib/types'
  import StudySentence from './StudySentence.svelte'
  import { Button } from 'svelte-pieces'

  export let data
  $: ({ content, user } = data)
  // eslint-disable-next-line no-undef, @typescript-eslint/no-unused-vars
  let state: YT.PlayerState

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let playbackRate = 1
  // eslint-disable-next-line no-undef
  let player: YT.Player
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let interval: number
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let currentTime: number

  const MILLISECONDS_BETWEEN_TIME_CHECKS = 20

  // eslint-disable-next-line no-undef
  function onReady(e: CustomEvent<YT.Player>) {
    player = e.detail
    interval = window.setInterval(() => {
      currentTime = player.getCurrentTime()
    }, MILLISECONDS_BETWEEN_TIME_CHECKS)
  }

  let currentStudySentence: Sentence
  function studySentence(sentence: Sentence) {
    currentStudySentence = sentence
  }

  $: captionsLength = $content.paragraphs?.map(paragraph => {
    return paragraph.sentences?.map(sentence => sentence.text).join('\n')
  }).join('\n\n').length
</script>

<div class="px-3 flex items-start">
  <div class="w-1/2 sticky z-1 top-0">
    <Youtube
      videoId={$page.params.youtubeId}
      on:ready={onReady}
      on:playbackRateChange={({ detail: { data } }) => (playbackRate = data)}
      on:stateChange={({ detail: { data } }) => (state = data)} />
    <div class="my-2">
      {#if $content.paragraphs}
        {#if !$content?.paragraphs?.[0].sentences?.[0]?.syntax}
          <div>
            <Button onclick={data.analyze_syntax}>{$page.data.t.shows.analyze}</Button>
          </div>
        {/if}

        {#if $content?.paragraphs?.[0]?.sentences?.[0]?.machine_translation?.en}
          {#if currentStudySentence}
            <StudySentence sentence={currentStudySentence} />
          {:else}
            Hover/click on sentence to study.
          {/if}
        {:else}
          <div class="mb-1"></div>
          <Button onclick={data.translate}>{$page.data.t.shows.translate}</Button>
        {/if}
      {/if}
    </div>
  </div>
  <div class="w-1/2 pl-2 text-3xl">
    {#if $content.paragraphs}
      <div class="border-b pb-2 mb-2">
        <div class="text-xs text-gray mb-2">
          {$page.data.t.shows.summary}
        </div>
        {#if $content.summary}
          <Paragraphs {studySentence} paragraphs={$content.summary} />
          <Button size="sm" form="simple" color="red" onclick={data.deleteSummary}>delete</Button>
        {:else}
          <Button onclick={data.getSummary}>{$page.data.t.shows.summarize}</Button>
        {/if}
      </div>
    {/if}
    <div>
      {#if $content.paragraphs}
        <div class="text-xs text-gray">({captionsLength} characters)</div>
        <Paragraphs {studySentence} paragraphs={$content.paragraphs} />
        <Button size="sm" form="simple" color="red" onclick={data.deleteContent}>Delete All</Button>
      {:else if $user}
        {#if $user.session.user.email === 'jacob@polylingual.dev'}
          <Button size="sm" onclick={data.getCaptions}>{$page.data.t.shows.get_captions}</Button>
        {:else}
          Sorry, the tool is not ready yet. Thank you for your interest. I will use your email address to notify you when it is ready.
        {/if}
      {:else}
        {$page.data.t.layout.sign_in}
      {/if}
    </div>
  </div>
</div>
