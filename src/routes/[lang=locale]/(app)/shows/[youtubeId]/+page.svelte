<script lang="ts">
  import { page } from '$app/stores'
  import Youtube from './Youtube.svelte'
  import type { Sentence } from '$lib/types'
  import StudySentence from './StudySentence.svelte'
  import { Button } from 'svelte-pieces'
  import Content from './Content.svelte'

  export let data
  $: ({ content, user, getCaptions, getSummary, deleteContent, deleteSummary } = data)

  let playbackRate = 1
  let currentTimeMs: number
  let playerState: YT.PlayerState

  let youtubeComponent: Youtube

  function readState(state: YT.PlayerState) {
    playerState = state
  }
  function readCurrentTime(ms: number) {
    currentTimeMs = ms
  }
  function setPlaybackRate(rate: number) {
    playbackRate = rate
    youtubeComponent.setPlaybackRate(rate)
  }

  let currentStudySentence: Sentence
  function studySentence(sentence: Sentence) {
    currentStudySentence = sentence
  }
</script>

<div class="px-3 flex items-start">
  <div class="w-1/2 sticky z-1 top-0">
    <Youtube
      bind:this={youtubeComponent}
      videoId={$page.params.youtubeId}
      {readState}
      {readCurrentTime}
      {setPlaybackRate}
      {playbackRate} />
    {playbackRate}, {currentTimeMs}, {playerState}

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
    <Content
      {getCaptions}
      {getSummary}
      {deleteSummary}
      {deleteContent}
      content={$content} email={$user?.session.user.email} {studySentence} />
  </div>
</div>
