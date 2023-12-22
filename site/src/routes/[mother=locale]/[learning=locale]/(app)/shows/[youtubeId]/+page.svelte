<script lang="ts">
  import { page } from '$app/stores'
  import Youtube, { PlayerState } from './Youtube.svelte'
  import type { CEDictEntry, Sentence } from '$lib/types'
  import StudySentence from './StudySentence.svelte'
  import { Button } from 'svelte-pieces'
  import Content from './Content.svelte'
  import Summary from './Summary.svelte'
  import { browser } from '$app/environment'
  import type { Transcript } from '$lib/supabase/database.types'
  import { goto } from '$app/navigation'
  import Description from './Description.svelte'
  import { format_time } from '$lib/utils/format_time'

  export let data
  $: ({ youtube, summary, error, streamed, check_is_in_my_videos, remove_from_my_videos, user, transcribe_captions, addSummary, supabase } = data)

  let cedict: Record<string, CEDictEntry> = {}
  $: if (streamed.cedict)
    streamed.cedict.then((c) => cedict = c)

  let transcript: Transcript
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
      youtube_id={youtube.id}
      {readState}
      {readCurrentTime}
      {setPlaybackRate}
      {playbackRate} />

    <div class="mt-2 bg-gray-100 p-3 rounded overflow-y-auto grow-1 flex flex-col">
      {#if transcript}
        <!-- {@const hasSyntaxAnalysis = transcript.transcript.sentences[0].syntax} -->
        {@const hasMachineTranslation = transcript.transcript.sentences[0].translation}
        <div class="mb-1">
          <!-- {#if !hasSyntaxAnalysis}
            <Button onclick={() => data.analyze_syntax(transcript.transcript.sentences)}>{$page.data.t.shows.analyze}</Button>
          {/if} -->

          {#if !hasMachineTranslation}
            <Button onclick={() => data.translate(transcript.transcript.sentences)}>{$page.data.t.shows.translate}</Button>
          {/if}
        </div>

        {#if currentStudySentence}
          <StudySentence playing={playerState === PlayerState.PLAYING} entries={cedict} onmouseenter={() => youtubeComponent.pause()} onmouseleave={() => youtubeComponent.play()} sentence={currentStudySentence} />
        {:else}
          Hover/click on sentence to study.
        {/if}
      {/if}
    </div>
  </div>
  <div class="w-1/2 pl-2">
    {#if error}
      Error: {error}
      {#if !$user}
        - please sign in
      {/if}
    {:else}
      {#if $user}
        <Button color="red" form="simple" title="Remove Video" onclick={async () => {
          await remove_from_my_videos(youtube.id, supabase)
          goto(`/${$page.params.mother}/${$page.params.learning}/shows`)
        }}><span class="i-fa6-regular-trash-can -mb-.5" /></Button>
      {/if}

      {youtube.title}
      {#if youtube.duration_seconds}
        <span class="bg-black rounded text-white text-xs px-1 py.5">{format_time(youtube.duration_seconds)}</span>
      {/if}
      <Description description={youtube.description} />

      {#if transcript?.transcript.sentences}
        <Summary {addSummary}
          {studySentence} sentences={$summary?.sentences} transcript={transcript.transcript.sentences} />
      {/if}

      {#if transcript !== undefined}
        <Content
          entries={cedict}
          {transcribe_captions}
          {youtubeComponent}
          {playerState}
          {currentTimeMs}
          {setTime}
          content={transcript?.transcript}
          {studySentence} />
      {/if}
    {/if}
  </div>
</div>
