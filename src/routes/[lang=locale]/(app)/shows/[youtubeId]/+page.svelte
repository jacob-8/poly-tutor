<script lang="ts">
  import { page } from '$app/stores'
  import Youtube, { PlayerState } from './Youtube.svelte'
  import type { Sentence } from '$lib/types'
  import StudySentence from './StudySentence.svelte'
  import { Button } from 'svelte-pieces'
  import Content from './Content.svelte'

  export let data
  $: ({ content, summary, user, getCaptions, getSummary, deleteContent, deleteSummary } = data)

  let playbackRate = 1
  let currentTimeMs = 0
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
  function setTime(ms: number) {
    youtubeComponent.seekToMs(ms)
    youtubeComponent.play()
  }

  let currentStudySentence: Sentence
  function studySentence(sentence: Sentence) {
    currentStudySentence = sentence
  }
</script>

<div class="px-3 flex items-start">
  <div class="w-1/2 sticky z-1 top-0 h-100vh flex flex-col py-2">
    <Youtube
      bind:this={youtubeComponent}
      videoId={$page.params.youtubeId}
      {readState}
      {readCurrentTime}
      {setPlaybackRate}
      {playbackRate} />

    <div class="mt-2 bg-gray-100 p-3 rounded overflow-y-auto grow-1 flex flex-col">
      {#if $content.paragraphs}
        <div class="mb-1">
          {#if !$content?.paragraphs?.[0].sentences?.[0]?.syntax}
            <Button onclick={data.analyze_syntax}>{$page.data.t.shows.analyze}</Button>
          {/if}

          {#if !$content?.paragraphs?.[0]?.sentences?.[0]?.machine_translation?.en}
            <Button onclick={data.translate}>{$page.data.t.shows.translate}</Button>
          {/if}
        </div>

        {#if currentStudySentence}
          {#await data.streamed.cedict}
            Loading dictionary...
          {:then entries}
            <StudySentence playing={playerState === PlayerState.PLAYING} {entries} onmouseenter={() => youtubeComponent.pause()} onmouseleave={() => youtubeComponent.play()} sentence={currentStudySentence} />
          {:catch error}
            Loading dictionary error: {error.message}
          {/await}
        {:else}
          Hover/click on sentence to study.
        {/if}
      {/if}
    </div>
  </div>
  <div class="w-1/2 pl-2 text-3xl">
    {#await data.streamed.cedict}
      Loading dictionary...
    {:then entries}
      <Content
        {entries}
        {getCaptions}
        {getSummary}
        {deleteSummary}
        {deleteContent}
        {currentTimeMs}
        {setTime}
        content={$content}
        summary={$summary}
        email={$user?.session.user.email}
        {studySentence} />
    {:catch error}
      Loading dictionary error: {error.message}
    {/await}
  </div>
</div>
