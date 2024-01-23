<script lang="ts">
  import { page } from '$app/stores'
  import Youtube, { PlayerState } from './Youtube.svelte'
  import type { Sentence, StudyWords } from '$lib/types'
  import StudySentence from './StudySentence.svelte'
  import { Button } from 'svelte-pieces'
  import Sentences from './Sentences.svelte'
  import { browser } from '$app/environment'
  import { goto, invalidateAll } from '$app/navigation'
  import { format_time } from '$lib/utils/format_time'
  import ShowMeta from './ShowMeta.svelte'
  import StudyLesson from '$lib/components/StudyLesson.svelte'
  import { onMount } from 'svelte'
  import { get_study_words_object } from '$lib/utils/study-words-object'
  import ShowLayout from './ShowLayout.svelte'
  import Controls from './Controls.svelte'
  import User from '$lib/layout/User.svelte'
  import type { LanguageCode } from '$lib/i18n/locales'

  export let data
  $: ({ youtube, summary, error, title, description, content, check_is_in_my_videos, remove_from_my_videos, user, transcribe_captions, addSummary, supabase, settings, user_vocabulary, learning } = data)
  $: ({ changed_words } = user_vocabulary)
  $: language = learning.split('-')[0] as LanguageCode

  let sentences: Sentence[]
  let study_words: StudyWords
  $: study_words_object = get_study_words_object(study_words)

  onMount(() => {
    content.then((content) => {
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
</script>

<ShowLayout>
  <div slot="header" class="h-full p-1 flex items-center">
    <a aria-label="Back Button" href="../shows"><span class="i-iconamoon-arrow-left-1 text-lg" /></a>
    <span class="hidden md:block">
      {youtube.title || ''}
    </span>
    <div class="mr-auto" />
    <Controls />
    {#if browser}
      <User user={data.user} sign_out={async () => {
        await data.supabase?.auth.signOut()
        invalidateAll()
      }} />
    {/if}
  </div>

  <div slot="player">
    <Youtube
      bind:this={youtubeComponent}
      youtube_id={youtube.id}
      {readState}
      {readCurrentTime}
      {setPlaybackRate}
      {playbackRate} />
  </div>

  <div slot="study" class="p-2">
    {#if currentStudySentence}
      <StudySentence {language} changed_words={$changed_words} change_word_status={data.user_vocabulary.change_word_status} {study_words_object} sentence={currentStudySentence} />
    {:else}
      <StudyLesson changed_words={$changed_words} change_word_status={data.user_vocabulary.change_word_status} {study_words} />
      <!-- {$page.data.t.shows.click_to_study} -->
    {/if}
  </div>

  <div slot="sentences" let:in_view>
    {#if error}
      {$page.data.t.layout.error}: {error}
      {#if !$user}
        - {$page.data.t.layout.sign_in}
      {/if}
    {:else}
      {#await title then [sentence]}
        <ShowMeta {language} changed_words={$changed_words} {study_words_object} label={$page.data.t.shows.title} settings={$settings} {sentence} {studySentence} add_seen_sentence={data.user_vocabulary.add_seen_sentence} />
      {/await}

      {#if $user}
        <div class="border-b pb-2 mb-2">
          <Button color="red" form="simple" title={$page.data.t.shows.remove_video} onclick={async () => {
            await remove_from_my_videos(youtube.id, supabase)
            goto(`/${$page.params.mother}/${$page.params.learning}/shows`)
          }}><span class="i-fa6-regular-trash-can -mb-.5" /></Button>
        </div>
      {/if}

      {#await description then [sentence]}
        <ShowMeta {language} changed_words={$changed_words} {study_words_object} label={$page.data.t.shows.description} settings={$settings} {sentence} {studySentence} add_seen_sentence={data.user_vocabulary.add_seen_sentence} />
      {/await}

      {#if sentences}
        {#if $summary?.length}
          <ShowMeta {language} changed_words={$changed_words} {study_words_object} label={$page.data.t.shows.summary} settings={$settings} sentence={$summary[0]} {studySentence} add_seen_sentence={data.user_vocabulary.add_seen_sentence} />
        {:else}
          <div class="border-b pb-2 mb-2 px-2 sm:px-0">
            <Button onclick={() => addSummary({sentences})}>{$page.data.t.shows.summarize}</Button>
          </div>
        {/if}
      {/if}

      <div class="flex">
        {#if youtube.duration_seconds}
          <div class="text-gray text-xs mb-2 capitalize px-2 sm:px-0">0:00 - {format_time(youtube.duration_seconds)} {$page.data.t.shows.captions}</div>
        {/if}

        {#if sentences && !sentences?.[0]?.translation?.[data.mother]}
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
              {in_view}
              {language}
              changed_words={$changed_words}
              {study_words_object}
              settings={$settings}
              add_seen_sentence={data.user_vocabulary.add_seen_sentence}
              play={youtubeComponent.play}
              pause={youtubeComponent.pause}
              seekToMs={youtubeComponent.seekToMs}
              isPlaying={playerState === PlayerState.PLAYING || playerState === PlayerState.BUFFERING} {currentTimeMs} {studySentence} {sentences} />
          {:else}
            <Button size="lg" class="mt-2 mx-2 sm:mx-0 mb-10" onclick={async () => {
              const result = await transcribe_captions()
              if (result)
                ({ sentences, study_words } = result)
            }}>{$page.data.t.shows.get_captions}</Button>
          {/if}
        {/if}
      {/await}
    {/if}
  </div>
</ShowLayout>

<!-- {#if translation_on_mobile && currentStudySentence?.translation?.[$page.data.mother]}
  <div class="fixed bottom-11.25 left-0 right-0 bg-white border-t p-2 z-2 text-sm">
    {currentStudySentence?.translation?.[$page.data.mother]}
  </div>
{/if} -->

<style>
  a {
    --at-apply: px-2 py-2 hover:bg-gray/20 rounded flex items-center;
  }
</style>
