<script lang="ts">
  import { page } from '$app/stores'
  import Youtube, { PlayerState } from './Youtube.svelte'
  import type { Sentence, StudyWords, Translation, YoutubeChapter } from '$lib/types'
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
  import { calculate_tokens_cost, calculate_transcription_cost } from '$lib/utils/calculate-cost'
  import ShowMeta from './ShowMeta.svelte'
  import SummaryComponent from './Summary.svelte'

  export let data
  $: ({ youtube_id, youtube_promise, user, supabase, settings, user_vocabulary, language, mother } = data)
  $: ({ changed_words } = user_vocabulary)

  let chapter_index = $page.url.searchParams.get('chapter') ? parseInt($page.url.searchParams.get('chapter')) : 0
  let youtube: YouTube
  let adding_youtube_error: string
  let entire_transcript: Sentence[]
  let summaries: Summary[]
  let transcript_status: 'checking-db' | 'none' | 'exists' = 'checking-db'

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
      transcript_status = _transcript ? 'exists' : 'none'
    })
  })

  let chapter: YoutubeChapter
  let summary: Translation
  let sentences: Sentence[]
  let study_words: StudyWords
  $: study_words_object = get_study_words_object(study_words)
  $: if (youtube) prepare_chapter(chapter_index, entire_transcript)

  async function prepare_chapter(index: number, transcript: Sentence[]) {
    chapter = youtube.chapters[index]
    if (!transcript)
      return

    const current_summary = summaries?.find(sum => sum.start_ms === chapter.start_ms && sum.end_ms === chapter.end_ms)
    summary = current_summary?.translations || null

    // TODO: When YouTube chapters are larger than 15 minutes, need to split into smaller chunks (sub-chapters) for listening and study words, but still retain the chapter bounds for summary as the measurements for how to split YouTube chapters is flexible. We don't want to create summaries for section sizes that may change in the future.
    const sentences_for_chapter = transcript.filter(sent => sent.start_ms >= chapter.start_ms && sent.start_ms <= chapter.end_ms);
    ({sentences, study_words} = await data.analyze_sentences(sentences_for_chapter))
  }

  let checked_for_video = false
  $: if (browser && !checked_for_video && $user && youtube) {
    checked_for_video = true
    data.check_is_in_my_videos(youtube.id, supabase)
  }

  function change_chapter(index: number) {
    chapter_index = index
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
</script>

<ShowLayout>
  <div slot="header" class="h-full p-1 flex items-center" let:scroll_to_study>
    <a aria-label="Back Button" href="../shows"><span class="i-iconamoon-arrow-left-1 text-lg" /></a>
    <span class="hidden md:block text-nowrap shrink-1">
      {youtube?.title.map(sentence => sentence.text).join(' ').substring(0, 30) || ''}
    </span>
    <div class="mr-auto" />
    {#if study_words}
      <button type="button" class="header-btn" on:click={() => {
        youtubeComponent.pause()
        scroll_to_study()
        currentStudySentence = null
      }}>
        <span class="i-ic-baseline-manage-search text-xl" />
      </button>
    {/if}
    <div id="playback-controls" class="contents" />

    {#if browser}
      <User user={data.user} sign_out={async () => {
        await data.supabase?.auth.signOut()
        invalidateAll()
      }} />
    {/if}
  </div>

  <div slot="chat-header" class="h-full p-1 flex items-center" let:scroll_to_main>
    <div class="font-semibold px-1">
      Chat
    </div>
    <div class="ml-auto"></div>
    <button type="button" class="header-btn" on:click={scroll_to_main}>
      <span class="i-fa-solid-times" />
    </button>
  </div>

  <div slot="study-header" class="h-full p-1 flex items-center" let:scroll_to_main>
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
    {/if}
  </div>

  <div slot="chat" class="p-2">
    <Chat />
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
      <div class="px-2 sm:px-0">{$page.data.t.layout.loading}<span class="i-svg-spinners-3-dots-fade align--4px ml-1" /></div>
    {:else if youtube}
      <ShowMeta {language} {mother} changed_words={$changed_words} {study_words_object} label={$page.data.t.shows.title} settings={$settings} sentences={youtube.title} {studySentence} split_sentences={data.split_sentences} />

      <ShowMeta {language} {mother} changed_words={$changed_words} {study_words_object} label={$page.data.t.shows.description} settings={$settings} sentences={youtube.description} {studySentence} split_sentences={data.split_sentences} />

      {#if transcript_status === 'checking-db'}
        <div class="px-2 sm:px-0">{$page.data.t.layout.loading}<span class="i-svg-spinners-3-dots-fade align--4px ml-1" /></div>
      {:else if transcript_status === 'none'}
        <Button size="lg" form="filled" class="mx-2 sm:mx-0 mt-2 mb-10" onclick={async () => {
          const result = await data.transcribe()
          if (result) {
            entire_transcript = result
            transcript_status = 'exists'
          }
        }}>{$page.data.t.shows.get_captions} ({calculate_transcription_cost({duration_seconds: youtube.duration_seconds * 2})})</Button>
        <!-- doubled the duration because the Google Translate costs are roughly equivalent to the speech-to-text costs -->
      {:else if sentences}
        <SelectChapter handle_chapter_select={event => {
          // @ts-ignore
          change_chapter(event.target.value)}} {chapter_index} {youtube} />

        <SummaryComponent {summary} {mother}>
          <Button class="mb-2" form="menu" onclick={async () => {
            summary = await data.summarize_chapter({sentences, start_ms: chapter.start_ms, end_ms: chapter.end_ms, title: youtube.title.map(s => s.text).join(' ')})
            summaries.push({
              translations: summary,
              start_ms: chapter.start_ms,
              end_ms: chapter.end_ms,
              created_at: new Date().toISOString(),
              created_by: $user.id,
              id: null,
              updated_at: null,
              source: null,
              youtube_id: youtube.id,
              title: '',
              description: '',
            })
          }}><span class="i-material-symbols-page-info-outline text-xl -mb-1 mr-1" />{$page.data.t.shows.summarize_chapter} ({calculate_tokens_cost({sentences, language})})</Button>
        </SummaryComponent>

        <Button form="menu" class="mb-2 sm:hidden! flex items-center" onclick={() => {
          youtubeComponent.pause()
          scroll_to_study()
          currentStudySentence = null
        }}>
          <span class="i-ic-baseline-manage-search text-xl -mb-1 mr-1" /> Preview Unknown Words
        </Button>

        {#key chapter_index}
          <Sentences
            {in_view}
            {language}
            {mother}
            changed_words={$changed_words}
            {study_words_object}
            settings={$settings}
            add_seen_sentence={user_vocabulary.add_seen_sentence}
            play={youtubeComponent.play}
            pause={youtubeComponent.pause}
            set_volume={youtubeComponent.set_volume}
            seekToMs={youtubeComponent.seekToMs}
            next_chapter={() => change_chapter(+chapter_index + 1)}
            is_last_chapter={chapter_index == youtube.chapters.length - 1}
            {isPlaying}
            {current_time_ms}
            {studySentence}
            {sentences} />
        {/key}

        <div class="mt-2"></div>
        {#if sentences.length > 10}
          <SelectChapter handle_chapter_select={event => {
            // @ts-ignore
            change_chapter(event.target.value)}} {chapter_index} {youtube} />
        {/if}
        <SelectSpeechSynthesisVoice locale={mother} />

        {#if $user}
          <Button class="mb-2" color="red" form="simple" size="sm" title={$page.data.t.shows.remove_video} onclick={async () => {
            await data.remove_from_my_videos(youtube.id, supabase)
            goto(`/${$page.params.mother}/${$page.params.learning}/shows`)
          }}><span class="i-fa6-regular-trash-can -mb-.5" /> {$page.data.t.shows.remove_video}</Button>
        {/if}
      {/if}
    {/if}
  </div>
</ShowLayout>

<style>
  a {
    --at-apply: px-2 py-2 hover:bg-gray/20 rounded flex items-center;
  }
</style>
