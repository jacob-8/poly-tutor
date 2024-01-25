<script lang="ts">
  import type { Sentence, Settings, StudyWordsObject, UserVocabulary } from '$lib/types'
  import SentenceComponent from '$lib/components/Sentence.svelte'
  import { portal } from './portal'
  import type { LanguageCode } from '$lib/i18n/locales'
  import { speakPromise } from '$lib/utils/speak'

  export let language: LanguageCode
  export let sentences: Sentence[] = []
  export let study_words_object: StudyWordsObject
  export let changed_words: UserVocabulary = {}
  export let studySentence: (sentence: Sentence) => void
  export let settings: Settings
  export let currentTimeMs: number
  export let isPlaying: boolean
  export let paddingMilliseconds = 500 // 250
  export let play: () => void
  export let pause: () => void
  export let set_volume: (volume: number) => void
  export let seekToMs: (ms: number) => void
  export let add_seen_sentence: (words: string[]) => void
  export let in_view: boolean

  let stop_time_ms: number
  let start_time_ms: number
  let user_updated_position: Date | null = null
  let selected_caption_index = 0
  let current_caption_index = 0
  let mode: 'normal' | 'repeat' | 'bilingual' = 'normal'
  let read_translation_for_caption: number
  let is_reading_translation = false

  $: watch_time(currentTimeMs)

  function watch_time(time_ms: number) {
    if (is_reading_translation) return

    if (stop_time_ms) {
      if (time_ms >= stop_time_ms + paddingMilliseconds) {
        if (mode === 'repeat')
          start_player_at(start_time_ms)
        else
          pause()
      }
      return
    }

    const user_recently_updated_position = user_updated_position && Date.now() - user_updated_position.getTime() < 2000
    if (user_recently_updated_position)
      return

    update_current_index_when_needed(time_ms)
  }

  function update_current_index_when_needed(current_time_ms: number) {
    const index = find_caption_index_by_time(current_time_ms)
    if (index === -1) {
      const playing_prior_to_first_caption = current_time_ms < sentences[0]?.start_ms
      if (playing_prior_to_first_caption)
        set_current_caption_index(0)
      return
    }

    if (current_caption_index === index) return

    const is_prior_to_selected_because_of_play_padding = index === selected_caption_index - 1
    if (is_prior_to_selected_because_of_play_padding) return

    if (mode === 'bilingual' && index === current_caption_index + 1 && read_translation_for_caption !== current_caption_index)
      return read_translation_then_repeat_caption(current_caption_index)

    console.info({ index, current_caption_index, read_translation_for_caption, is_reading_translation })
    set_current_caption_index(index)
  }

  async function read_translation_then_repeat_caption(index: number) {
    const caption = sentences[index]
    is_reading_translation = true
    await ease_volume({from: 100, to: 0, duration_ms: paddingMilliseconds})
    await speakPromise({ text: caption.translation?.en, rate: 1, locale: 'en', volume: .8})
    seekToMs(caption.start_ms - paddingMilliseconds)
    await ease_volume({from: 0, to: 100, duration_ms: paddingMilliseconds})
    is_reading_translation = false
    read_translation_for_caption = index
    console.info(`marked ${index} as read`)
  }

  async function ease_volume({ from, to, duration_ms }: { from: number, to: number, duration_ms: number }): Promise<void> {
    const stepCount: number = Math.abs(to - from)
    const msPerStep: number = duration_ms / stepCount

    if (from < to) {
      for (let vol = from; vol <= to; vol += 1) {
        set_volume(vol)
        await new Promise(resolve => setTimeout(resolve, msPerStep))
      }
    } else {
      for (let vol = from; vol >= to; vol -= 1) {
        set_volume(vol)
        await new Promise(resolve => setTimeout(resolve, msPerStep))
      }
    }
  }

  function find_caption_index_by_time(current_milliseconds: number) {
    return sentences.findIndex(({ start_ms, end_ms }) => {
      const isAfterStart = current_milliseconds > start_ms
      const isBeforeEnd = current_milliseconds < end_ms
      return isAfterStart && isBeforeEnd
    })
  }

  $: scroll_to_caption(current_caption_index)

  function scroll_to_caption(index: number) {
    document.querySelector(`#caption_${index}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  function play_and_select({ start_ms, end_ms, index }: { start_ms: number; end_ms?: number; index: number }) {
    user_updated_position = new Date()
    start_player_at(start_ms)
    select_caption(index)
    stop_time_ms = end_ms || null
  }

  function select_caption(index: number) {
    selected_caption_index = index
    set_current_caption_index(index)
  }

  function set_current_caption_index(index: number) {
    console.info({setCurrentCaption: index})
    studySentence(sentences[index])
    current_caption_index = index
  // const url = new URL($page.url.toString())
    // url.searchParams.set(CAPTION_SEARCH_PARAM, index.toString())
    // window.history.replaceState({}, '', url.toString())
  }

  function start_player_at(time_ms: number) {
    start_time_ms = time_ms // set for loop mode
    play()
    seekToMs(time_ms - paddingMilliseconds)
  }

  function seekToPrevious() {
    current_caption_index = Math.max(0, current_caption_index - 1)
    const previousCaption = sentences[current_caption_index]
    const end_ms = stop_time_ms ? previousCaption.end_ms : null
    if (isPlaying) {
      play_and_select({ start_ms: previousCaption.start_ms, index: current_caption_index, end_ms })
    } else {
      seekToMs(previousCaption.start_ms)
      studySentence(sentences[current_caption_index])
    }
  }
  function seekToNext() {
    current_caption_index = Math.min(sentences.length, current_caption_index + 1)
    const nextCaption = sentences[current_caption_index]
    const end_ms = stop_time_ms ? nextCaption.end_ms : null
    if (isPlaying) {
      play_and_select({ start_ms: nextCaption.start_ms, index: current_caption_index, end_ms })
    } else {
      seekToMs(nextCaption.start_ms)
      studySentence(sentences[current_caption_index])
    }
  }
  function playCaptionOnLoop() {
    mode = 'repeat'
    const currentCaption = sentences[current_caption_index]
    play_and_select({ start_ms: currentCaption.start_ms, index: current_caption_index, end_ms: currentCaption.end_ms })
  }
  // function playCaptionOnce() {
  //   mode = 'play-once'
  //   const currentCaption = sentences[current_caption_index]
  //   play_and_select({ start_ms: currentCaption.start_ms, index: current_caption_index, end_ms: currentCaption.end_ms })
  // }
  function playBilingual() {
    mode = 'bilingual'
    const currentCaption = sentences[current_caption_index]
    play_and_select({ start_ms: currentCaption.start_ms, index: current_caption_index })
  }
  function playNormal() {
    mode = 'normal'
    const currentCaption = sentences[current_caption_index]
    play_and_select({ start_ms: currentCaption.start_ms, index: current_caption_index })
  }

  let paused_for_study = false
  $: if (isPlaying && !in_view) {
    pause()
    paused_for_study = true
  }
  $: if (paused_for_study && in_view) {
    play()
    paused_for_study = false
  }
</script>

{#each sentences as sentence, index}
  <SentenceComponent {language} {changed_words} {add_seen_sentence} {study_words_object} id="caption_{index}" {settings} {sentence} active={index === current_caption_index}
    onClick={() => {
      play_and_select({ start_ms: sentence.start_ms, index, end_ms: stop_time_ms ? sentence.end_ms : null })
    }} />
{/each}

<div class="contents" use:portal={'#playback-controls'}>
  {#if mode === 'bilingual' && isPlaying}
    <button type="button" class="active" on:click={pause}>
      <span class="i-carbon-pause-filled text-xl" />
    </button>
  {:else}
    <button type="button" title="Bilingual (shortcut: b)" class:active={mode === 'bilingual'} on:click={playBilingual}>
      <span class="i-ri-translate text-xl" />
    </button>
  {/if}
  {#if mode === 'repeat' && isPlaying}
    <button type="button" class="active" on:click={pause}>
      <span class="i-carbon-pause-filled text-xl" />
    </button>
  {:else}
    <button type="button" title="Repeat (shortcut: r)" class:active={mode === 'repeat'} on:click={playCaptionOnLoop}>
      <span class="i-ic-baseline-loop text-xl" />
    </button>
  {/if}
  {#if mode === 'normal' && isPlaying}
    <button type="button" class="active" on:click={pause}>
      <span class="i-carbon-pause-filled text-xl" />
    </button>
  {:else}
    <button type="button" title="Play normal (shortcut: n)" class:active={mode === 'normal'} on:click={playNormal}>
      <span class="i-carbon-play-filled-alt text-xl" />
    </button>
  {/if}
</div>

<svelte:window
  on:keydown={(event) => {
    const SPACEBAR = ' '
    if (event.key === SPACEBAR) {
      if (isPlaying)
        pause()
      else
        play()
      event.preventDefault()
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      seekToPrevious()
      event.preventDefault()
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      seekToNext()
      event.preventDefault()
    }
    // if (event.key === '1') {
    //   playCaptionOnce()
    //   event.preventDefault()
    // }
    if (event.key === 'b') {
      playBilingual()
      event.preventDefault()
    }
    if (event.key === 'r') {
      playCaptionOnLoop()
      event.preventDefault()
    }
    if (event.key === 'n') {
      playNormal()
      event.preventDefault()
    }
  }} />

<style>
  button {
    --at-apply: header-btn;
  }
  .active {
    --at-apply: bg-black hover:bg-black/70 text-white;
  }
</style>
