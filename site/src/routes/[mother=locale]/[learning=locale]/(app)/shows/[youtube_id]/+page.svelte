<script lang="ts">
  import { page } from '$app/stores'
  import Youtube, { PlayerState } from './Youtube.svelte'
  import type { Sentence, StudyWords, YoutubeChapter } from '$lib/types'
  import StudySentence from './StudySentence.svelte'
  import { Button } from 'svelte-pieces'
  import Sentences from './Sentences.svelte'
  import { browser } from '$app/environment'
  import { goto, invalidateAll } from '$app/navigation'
  import StudyLesson from '$lib/components/StudyLesson.svelte'
  import { onMount } from 'svelte'
  import { get_study_words_object } from '$lib/utils/study-words-object'
  import ShowLayout from './ShowLayout.svelte'
  import User from '$lib/layout/User.svelte'
  import UnknownInCurrentSentence from './UnknownInCurrentSentence.svelte'
  import SelectSpeechSynthesisVoice from '$lib/components/SelectSpeechSynthesisVoice.svelte'
  import type { Summary, YouTube } from '$lib/supabase/database.types'
  import SelectChapter from './SelectChapter.svelte'

  export let data
  $: ({ youtube_id, youtube_promise, user, supabase, settings, user_vocabulary, language } = data)
  $: ({ changed_words } = user_vocabulary)
  $: chapter_index = $page.url.searchParams.get('chapter') ? parseInt($page.url.searchParams.get('chapter')) : 0

  let youtube: YouTube
  let adding_youtube_error: string
  let entire_transcript: Sentence[]
  let summaries: Summary[]

  onMount(async () => {
    const { data: _youtube, error } = await youtube_promise
    if (error)
      return adding_youtube_error = error.message
    youtube = _youtube

    data.load_summaries().then(_summaries => {
      summaries = _summaries
    })
    data.load_transcript().then(_transcript => {
      entire_transcript = _transcript
    })
  })

  let chapter: YoutubeChapter
  let summary: Sentence[]
  let sentences: Sentence[]
  let study_words: StudyWords
  $: study_words_object = get_study_words_object(study_words)
  $: if (youtube) prepare_chapter(chapter_index, entire_transcript)

  async function prepare_chapter(index: number, transcript: Sentence[]) {
    chapter = youtube.chapters[index]
    if (!transcript) {
      if (transcript !== undefined)
        sentences = null // mark as null so page can know to show transcribe button
      return
    }

    const current_summary = summaries?.find(sum => sum.start_ms === chapter.start_ms && sum.end_ms === chapter.end_ms)
    summary = current_summary?.sentences || null

    const sentences_for_chapter = transcript.filter(sent => sent.start_ms >= chapter.start_ms && sent.start_ms <= chapter.end_ms);
    ({sentences, study_words} = await data.analyze_sentences(sentences_for_chapter))
  }

  let checked_for_video = false
  $: if (browser && !checked_for_video && $user && youtube) {
    checked_for_video = true
    data.check_is_in_my_videos(youtube.id, supabase)
  }

  function handle_chapter_select(event) {
    const chapter_index = event.target.value
    const url = new URL($page.url.toString())
    url.searchParams.set('chapter', chapter_index.toString())
    window.history.replaceState({}, '', url.toString())
  }

  let playbackRate = 1
  let current_time_ms = 0
  let playerState: YT.PlayerState
  $: isPlaying = playerState === PlayerState.PLAYING || playerState === PlayerState.BUFFERING

  let youtubeComponent: Youtube

  function readState(state: YT.PlayerState) {
    playerState = state
  }
  function readCurrentTime(ms: number) {
    current_time_ms = ms
  }
  function setPlaybackRate(rate: number) {
    playbackRate = rate
    youtubeComponent.setPlaybackRate(rate)
  }

  let currentStudySentence: Sentence
  function studySentence(sentence: Sentence) {
    currentStudySentence = sentence
  }

  const delay_render_to_not_slow_page_transition = new Promise(r => setTimeout(r, 200))
</script>

<ShowLayout>
  <div slot="header" class="h-full p-1 flex items-center" let:scroll_to_main let:scroll_to_study let:active_view>
    <div class:hidden={active_view !== 'main'} class="contents">
      <a aria-label="Back Button" href="../shows"><span class="i-iconamoon-arrow-left-1 text-lg" /></a>
      <span class="hidden md:block text-nowrap shrink-1">
        {youtube?.title.map(sentence => sentence.text).join(' ').substring(0, 30) || ''}
      </span>
      <div class="mr-auto" />
      <button type="button" class="header-btn" on:click={() => {
        scroll_to_study()
        currentStudySentence = null
      }}>
        <span class="i-ic-baseline-manage-search text-xl" />
      </button>
      <div id="playback-controls" class="contents" />

      {#if browser}
        <User user={data.user} sign_out={async () => {
          await data.supabase?.auth.signOut()
          invalidateAll()
        }} />
      {/if}
    </div>

    {#if active_view !== 'main'}
      {#if !currentStudySentence}
        <div class="font-semibold px-1">
          Study List
        </div>
      {/if}
      <div class="ml-auto"></div>
      {#if currentStudySentence}
        <button type="button" class="header-btn" on:click={() => {
          currentStudySentence = null
        }}>
          <span class="i-ic-baseline-manage-search text-xl" />
        </button>
      {/if}
      <button type="button" class="header-btn" on:click={scroll_to_main}>
        <span class="i-fa-solid-times" />
      </button>
    {/if}
  </div>

  <div slot="player">
    {#if currentStudySentence && isPlaying}
      <UnknownInCurrentSentence changed_words={$changed_words} sentence={currentStudySentence} />
    {/if}
    <Youtube
      bind:this={youtubeComponent}
      {youtube_id}
      {readState}
      {readCurrentTime}
      {setPlaybackRate}
      {playbackRate} />
  </div>

  <div slot="study" class="p-2">
    {#if currentStudySentence}
      <StudySentence {language} changed_words={$changed_words} change_word_status={user_vocabulary.change_word_status} {study_words_object} sentence={currentStudySentence} />
    {:else}
      <StudyLesson changed_words={$changed_words} change_word_status={user_vocabulary.change_word_status} {study_words} />
      <!-- {$page.data.t.shows.click_to_study} -->
    {/if}
  </div>

  <div slot="sentences" let:in_view let:scroll_to_study>
    {#if adding_youtube_error}
      <div class="px-2 text-red">
        {$page.data.t.layout.error}: {adding_youtube_error}
        {#if !$user}
          - {$page.data.t.layout.sign_in}
        {/if}
      </div>
    {:else if !youtube}
      <div class="px-2">{$page.data.t.layout.loading}...</div>
    {:else if youtube}
      <div class="px-2 sm:px-0 flex">
        <div class="font-semibold line-clamp-1 overflow-hidden">
          {youtube.title.map(sentence => sentence.text).join(' ')}
        </div>
        {#if $user}
          <Button class="-mt-.5" color="red" form="simple" size="sm" title={$page.data.t.shows.remove_video} onclick={async () => {
            await data.remove_from_my_videos(youtube.id, supabase)
            goto(`/${$page.params.mother}/${$page.params.learning}/shows`)
          }}><span class="i-fa6-regular-trash-can -mb-.5" /></Button>
        {/if}
      </div>

      <!-- await data.split_sentences -->
      <!-- {#await title then [sentence]}
        <ShowMeta {language} changed_words={$changed_words} {study_words_object} label={$page.data.t.shows.title} settings={$settings} {sentence} {studySentence} add_seen_sentence={user_vocabulary.add_seen_sentence} />
      {/await} -->

      <div class="px-2 sm:px-0 my-2">
        <div class="text-sm line-clamp-2 overflow-hidden">
          {$page.data.t.shows.description}: {youtube.description.map(sentence => sentence.text).join(' ')}
        </div>
      </div>
      <!-- {#await description then [sentence]}
        <ShowMeta {language} changed_words={$changed_words} {study_words_object} label={$page.data.t.shows.description} settings={$settings} {sentence} {studySentence} add_seen_sentence={user_vocabulary.add_seen_sentence} />
      {/await} -->

      <SelectChapter {handle_chapter_select} {chapter_index} {youtube} />

      {#await delay_render_to_not_slow_page_transition then _}
        {#if sentences === undefined}
          <div class="px-2">{$page.data.t.layout.loading}...</div>
        {:else}
          {#if sentences}
            {#if summary?.length}
              <div class="bg-gray-200 p-2 sm:rounded my-2">
                <div class="text-sm">{$page.data.t.shows.chapter_summary}</div>
                <div class="line-clamp-2 overflow-hidden">
                  {summary.map(({text}) => text).join('')}
                </div>
              </div>
              <!-- <ShowMeta {language} changed_words={$changed_words} {study_words_object} label={$page.data.t.shows.summary} settings={$settings} sentence={$summary[0]} {studySentence} add_seen_sentence={user_vocabulary.add_seen_sentence} /> -->
            {:else}
              <!-- <div class="mb-2 px-2 sm:px-0"> -->
              <Button form="menu" onclick={async () => summary = await data.summarize_chapter({sentences, start_ms: chapter.start_ms, end_ms: chapter.end_ms})}><span class="i-material-symbols-page-info-outline text-xl -mb-1 mr-1" />{$page.data.t.shows.summarize_chapter}</Button>
              <!-- </div> -->
            {/if}

            <Button form="menu" class="sm:hidden! flex items-center" onclick={() => {
              scroll_to_study()
              currentStudySentence = null
            }}>
              <span class="i-ic-baseline-manage-search text-xl -mb-1 mr-1" /> Preview Unknown Words
            </Button>

            <Sentences
              {in_view}
              {language}
              changed_words={$changed_words}
              {study_words_object}
              settings={$settings}
              add_seen_sentence={user_vocabulary.add_seen_sentence}
              play={youtubeComponent.play}
              pause={youtubeComponent.pause}
              set_volume={youtubeComponent.set_volume}
              seekToMs={youtubeComponent.seekToMs}
              {isPlaying} {current_time_ms} {studySentence} {sentences} />

            <SelectChapter {handle_chapter_select} {chapter_index} {youtube} />

            <SelectSpeechSynthesisVoice />

          {:else}
            <Button size="lg" form="filled" class="mx-2 sm:mx-0 mb-10" onclick={async () => {
              const result = await data.transcribe()
              if (result)
                entire_transcript = result
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
