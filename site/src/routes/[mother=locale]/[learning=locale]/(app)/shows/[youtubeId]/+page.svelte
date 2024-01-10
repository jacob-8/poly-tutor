<script lang="ts">
  import { page } from '$app/stores'
  import Youtube, { PlayerState } from './Youtube.svelte'
  import type { Sentence, StudyWords } from '$lib/types'
  import StudySentence from './StudySentence.svelte'
  import { Button } from 'svelte-pieces'
  import Sentences from './Sentences.svelte'
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { format_time } from '$lib/utils/format_time'
  import ShowMeta from './ShowMeta.svelte'
  import StudyLesson from '$lib/components/StudyLesson.svelte'
  import Viewport from './Viewport.svelte'
  import { onMount } from 'svelte'
  import { get_study_words_object } from '$lib/utils/study-words-object'

  export let data
  $: ({ youtube, summary, error, streamed, check_is_in_my_videos, remove_from_my_videos, user, transcribe_captions, addSummary, supabase, settings } = data)

  let sentences: Sentence[]
  let study_words: StudyWords
  $: study_words_object = get_study_words_object(study_words)

  onMount(() => {
    streamed.content.then((content) => {
      if (!content)
        return
      ({ sentences, study_words } = content )
    })
  })

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

  let translation_on_mobile = false
  let study_on_mobile = false
</script>

<div class="max-w-100rem w-full mx-auto sm:px-3 flex flex-col sm:flex-row items-start">
  <div class="w-full sm:w-1/2 sticky z-1 top-0 -mt-2 sm:h-100vh flex flex-col pb-2 sm:pt-2">
    <Youtube
      bind:this={youtubeComponent}
      youtube_id={youtube.id}
      {readState}
      {readCurrentTime}
      {setPlaybackRate}
      {playbackRate} />

    <Viewport let:width>
      {#if width >= 640}
        <div class="mt-2 overflow-y-auto grow-1 flex flex-col">
          {#if currentStudySentence}
            <StudySentence change_word_status={data.user_vocabulary.change_word_status} {study_words_object} sentence={currentStudySentence} />
          {:else}
            <StudyLesson change_word_status={data.user_vocabulary.change_word_status} {study_words} />
            <!-- {$page.data.t.shows.click_to_study} -->
          {/if}
        </div>
      {/if}
    </Viewport>
  </div>

  <div class="sm:w-1/2 sm:pl-2">
    {#if error}
      {$page.data.t.layout.error}: {error}
      {#if !$user}
        - {$page.data.t.layout.sign_in}
      {/if}
    {:else}
      {#await streamed.title then [sentence]}
        <ShowMeta {study_words_object} label={$page.data.t.shows.title} settings={$settings} {sentence} {studySentence} add_seen_sentence={data.user_vocabulary.add_seen_sentence} />
      {/await}

      {#if $user}
        <div class="border-b pb-2 mb-2">
          <Button color="red" form="simple" title={$page.data.t.shows.remove_video} onclick={async () => {
            await remove_from_my_videos(youtube.id, supabase)
            goto(`/${$page.params.mother}/${$page.params.learning}/shows`)
          }}><span class="i-fa6-regular-trash-can -mb-.5" /></Button>
        </div>
      {/if}

      {#await streamed.description then [sentence]}
        <ShowMeta {study_words_object} label={$page.data.t.shows.description} settings={$settings} {sentence} {studySentence} add_seen_sentence={data.user_vocabulary.add_seen_sentence} />
      {/await}

      {#if sentences}
        {#if $summary?.length}
          <ShowMeta {study_words_object} label={$page.data.t.shows.summary} settings={$settings} sentence={$summary[0]} {studySentence} add_seen_sentence={data.user_vocabulary.add_seen_sentence} />
        {:else}
          <div class="text-base border-b pb-2 mb-2">
            <Button onclick={() => addSummary({sentences})}>{$page.data.t.shows.summarize}</Button>
          </div>
        {/if}
      {/if}

      <div class="flex">
        {#if youtube.duration_seconds}
          <div class="text-gray text-xs mb-2 capitalize">0:00 - {format_time(youtube.duration_seconds)} {$page.data.t.shows.captions}</div>
        {/if}

        {#if sentences && !sentences?.[0]?.translation}
          <Button class="ml-auto" form="simple" size="sm" onclick={async () => {
            const sentences_with_translations = await data.translate(sentences)
            if (sentences_with_translations)
              // eslint-disable-next-line require-atomic-updates
              sentences = sentences_with_translations
          }}>{$page.data.t.shows.translate}</Button>
        {/if}
      </div>
      {#await new Promise(r => setTimeout(r, 200)) then _}
        {#if sentences !== undefined}
          {#if sentences}
            <Sentences
              {study_words_object}
              hideTranslation={() => translation_on_mobile = false}
              showTranslation={() => translation_on_mobile = true}
              toggleStudy={() => {
                if (study_on_mobile) {
                  study_on_mobile = false
                  youtubeComponent.play()
                } else {
                  study_on_mobile = true
                  youtubeComponent.pause()
                }
              }}
              settings={$settings}
              add_seen_sentence={data.user_vocabulary.add_seen_sentence}
              play={youtubeComponent.play}
              pause={youtubeComponent.pause}
              seekToMs={youtubeComponent.seekToMs}
              isPlaying={playerState === PlayerState.PLAYING || playerState === PlayerState.BUFFERING} {currentTimeMs} {studySentence} {sentences} />
          {:else}
            <div class="text-base">
              <Button size="lg" class="mt-2" onclick={async () => {
                const result = await transcribe_captions()
                if (result)
                  ({ sentences, study_words } = result)
              }}>{$page.data.t.shows.get_captions}</Button>
            </div>
          {/if}
        {/if}
      {/await}
    {/if}
  </div>
</div>

{#if study_on_mobile && currentStudySentence}
  <div class="bg-white fixed top-0 bottom-11.25 left-0 right-0 p-2 z-1 overflow-y-scroll">
    <StudySentence change_word_status={data.user_vocabulary.change_word_status} {study_words_object} sentence={currentStudySentence} />
  </div>
{/if}

{#if translation_on_mobile && currentStudySentence?.translation?.[$page.data.mother]}
  <div class="fixed bottom-11.25 left-0 right-0 bg-white border-t p-2 z-2 text-sm">
    {currentStudySentence?.translation?.[$page.data.mother]}
  </div>
{/if}
