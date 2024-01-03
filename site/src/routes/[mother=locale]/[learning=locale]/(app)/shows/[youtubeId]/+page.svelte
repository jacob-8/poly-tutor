<script lang="ts">
  import { page } from '$app/stores'
  import Youtube, { PlayerState } from './Youtube.svelte'
  import type { Section, Sentence } from '$lib/types'
  import StudySentence from './StudySentence.svelte'
  import { Button } from 'svelte-pieces'
  import Sentences from './Sentences.svelte'
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { format_time } from '$lib/utils/format_time'
  import ShowMeta from './ShowMeta.svelte'

  export let data
  $: ({ youtube, summary, error, streamed, check_is_in_my_videos, remove_from_my_videos, user, transcribe_captions, addSummary, supabase } = data)

  let transcript: Section
  $: if (streamed.transcript)
    streamed.transcript.then((t) => transcript = t)

  let checked_for_video = false
  $: if (browser && $user && !checked_for_video) {
    checked_for_video = true
    check_is_in_my_videos(youtube?.id, supabase)
  }

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

  let currentStudySentence: Sentence
  function studySentence(sentence: Sentence) {
    currentStudySentence = sentence
  }
</script>

<div class="px-3 flex items-start">
  <div class="w-1/2 sticky z-1 top-2 h-100vh flex flex-col pb-2">
    <Youtube
      bind:this={youtubeComponent}
      youtube_id={youtube.id}
      {readState}
      {readCurrentTime}
      {setPlaybackRate}
      {playbackRate} />

    <div class="mt-2 bg-gray-100 p-3 rounded overflow-y-auto grow-1 flex flex-col">
      {#if $user}
        <Button color="red" form="simple" title="Remove Video" onclick={async () => {
          await remove_from_my_videos(youtube.id, supabase)
          goto(`/${$page.params.mother}/${$page.params.learning}/shows`)
        }}><span class="i-fa6-regular-trash-can -mb-.5" /></Button>
      {/if}

      {#if transcript}
        <!-- {@const hasSyntaxAnalysis = transcript.sentences[0].syntax} -->
        {@const hasMachineTranslation = transcript.sentences?.[0]?.translation}
        <div class="mb-1">
          <!-- {#if !hasSyntaxAnalysis}
            <Button onclick={() => data.analyze_syntax(transcript.transcript.sentences)}>{$page.data.t.shows.analyze}</Button>
          {/if} -->

          {#if !hasMachineTranslation}
            <Button onclick={() => data.translate(transcript.sentences)}>{$page.data.t.shows.translate}</Button>
          {/if}
        </div>

        {#if currentStudySentence}
          <StudySentence playing={playerState === PlayerState.PLAYING} onmouseenter={() => youtubeComponent.pause()} onmouseleave={() => youtubeComponent.play()} sentence={currentStudySentence} />
        {:else}
          Hover/click on sentence to study.
        {/if}
      {/if}
    </div>
  </div>
  <div class="w-1/2 pl-2">
    {#if error}
      {$page.data.t.layout.error}: {error}
      {#if !$user}
        - {$page.data.t.layout.sign_in}
      {/if}
    {:else}
      {#await streamed.title then [sentence]}
        <ShowMeta label={$page.data.t.shows.title} {sentence} {studySentence} />
      {/await}

      {#await streamed.description then [sentence]}
        <ShowMeta label={$page.data.t.shows.description} {sentence} {studySentence} />
      {/await}

      {#if transcript?.sentences}
        {#if $summary?.length}
          <ShowMeta label={$page.data.t.shows.summary} sentence={$summary[0]} {studySentence} />
        {:else}
          <div class="text-base border-b pb-2 mb-2">
            <Button onclick={() => addSummary({sentences: transcript.sentences})}>{$page.data.t.shows.summarize}</Button>
          </div>
        {/if}
      {/if}

      {#if youtube.duration_seconds}
        <div class="text-gray text-xs mb-2 capitalize">0:00 - {format_time(youtube.duration_seconds)} {$page.data.t.shows.captions}</div>
      {/if}

      {#await new Promise(r => setTimeout(r, 200)) then _}
        {#if transcript !== undefined}
          {#if transcript?.sentences}
            <Sentences
              play={youtubeComponent.play}
              pause={youtubeComponent.pause}
              seekToMs={youtubeComponent.seekToMs}
              isPlaying={playerState === PlayerState.PLAYING || playerState === PlayerState.BUFFERING} {currentTimeMs} {studySentence} sentences={transcript.sentences} />
          {:else}
            <div class="text-base">
              <Button size="lg" class="mt-2" onclick={() => transcribe_captions()}>{$page.data.t.shows.get_captions}</Button>
              <!-- TODO: show price -->
            </div>
          {/if}
        {/if}
      {/await}
    {/if}
  </div>
</div>
