<script lang="ts">
  import type { Sentence, Settings, StudyWordsObject, UserVocabulary } from '$lib/types'
  import SentenceComponent from '$lib/components/Sentence.svelte'
  import { portal } from './portal'
  import type { LanguageCode } from '$lib/i18n/locales'
  import { speech } from '$lib/utils/speak'

  export let language: LanguageCode
  export let sentences: Sentence[] = []
  export let study_words_object: StudyWordsObject
  export let changed_words: UserVocabulary = {}
  export let studySentence: (sentence: Sentence) => void
  export let settings: Settings
  export let currentTimeMs: number
  export let isPlaying: boolean
  export let paddingMilliseconds = 250
  const volume_change_duration = 500
  export let play: () => void
  export let pause: () => void
  export let set_volume: (volume: number) => void
  export let seekToMs: (ms: number) => void
  export let add_seen_sentence: (words: string[]) => void
  export let in_view: boolean

  let mode: 'normal' | 'repeat' | 'bilingual' = 'normal'
  let intentionally_updated_at: number | null = null

  let selected_caption_index = 0
  let current_caption_index = 0
  let current_caption: Sentence

  let read_translation_for_caption: number
  let is_reading_translation = false
  let stop_reading_translation: () => void

  $: watch_time(currentTimeMs)

  function watch_time(time_ms: number) {
    if (is_reading_translation) return

    if (mode === 'repeat') {
      if (time_ms >= current_caption.end_ms + paddingMilliseconds)
        start_player_at(current_caption.start_ms)
      return
    }

    if (intentionally_updated_at) {
      const recently_updated_position = ( Date.now() - intentionally_updated_at ) < ( paddingMilliseconds + 1000 )
      if (recently_updated_position)
        return
    }

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

    set_current_caption_index(index)
  }

  const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  function read_translation_then_repeat_caption(index: number) {
    const caption = sentences[index]
    is_reading_translation = true
    ease_volume({from: 100, to: 0, duration_ms: volume_change_duration})
    const { speak, stop } = speech({ text: caption.translation?.en, rate: 1, locale: 'en', volume: .7})
    stop_reading_translation = stop
    speak.then(async () => {
      stop_reading_translation = null
      seekToMs(caption.start_ms - volume_change_duration)
      await sleep(volume_change_duration / 2)
      await ease_volume({from: 0, to: 100, duration_ms: volume_change_duration})
      intentionally_updated_at = Date.now()
      read_translation_for_caption = index
    }).catch(async () => {
      stop_reading_translation = null
      await ease_volume({from: 0, to: 100, duration_ms: volume_change_duration / 2})
    }).finally(() => {
      is_reading_translation = false
    })
  }

  async function ease_volume({ from, to, duration_ms }: { from: number, to: number, duration_ms: number }): Promise<void> {
    const steps = Math.abs(to - from)
    const ms_per_step = duration_ms / steps

    if (from < to) {
      for (let vol = from; vol <= to; vol += 1) {
        set_volume(vol)
        await sleep(ms_per_step)
      }
    } else {
      for (let vol = from; vol >= to; vol -= 1) {
        set_volume(vol)
        await sleep(ms_per_step)
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

  function user_wants_to_play_new_location({ start_ms, index }: { start_ms: number; index: number }) {
    intentionally_updated_at = Date.now()
    stop_reading_translation?.()
    start_player_at(start_ms)
    select_caption(index)
  }

  function select_caption(index: number) {
    selected_caption_index = index
    set_current_caption_index(index)
  }

  function set_current_caption_index(index: number) {
    current_caption_index = index
    current_caption = sentences[index]
    studySentence(current_caption)
  // const url = new URL($page.url.toString())
    // url.searchParams.set(CAPTION_SEARCH_PARAM, index.toString())
    // window.history.replaceState({}, '', url.toString())
  }

  function start_player_at(time_ms: number) {
    seekToMs(time_ms - paddingMilliseconds)
    play()
  }

  function seek_by_steps(steps: number) {
    current_caption_index = Math.max(0, current_caption_index + steps) // +1 for next and -1 for previous
    current_caption = sentences[current_caption_index]
    if (isPlaying) {
      user_wants_to_play_new_location({ start_ms: current_caption.start_ms, index: current_caption_index })
    } else {
      seekToMs(current_caption.start_ms)
      studySentence(sentences[current_caption_index])
    }
  }
  function playCaptionOnLoop() {
    mode = 'repeat'
    current_caption = sentences[current_caption_index]
    user_wants_to_play_new_location({ start_ms: current_caption.start_ms, index: current_caption_index })
  }
  function playBilingual() {
    mode = 'bilingual'
    current_caption = sentences[current_caption_index]
    user_wants_to_play_new_location({ start_ms: current_caption.start_ms, index: current_caption_index })
  }
  function playNormal() {
    mode = 'normal'
    current_caption = sentences[current_caption_index]
    user_wants_to_play_new_location({ start_ms: current_caption.start_ms, index: current_caption_index })
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
  <SentenceComponent {language} {changed_words} {add_seen_sentence} {study_words_object} id="caption_{index}" {settings} {sentence} active={index === current_caption_index} show={index < current_caption_index}
    onClick={() => {
      user_wants_to_play_new_location({ start_ms: sentence.start_ms, index })
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
      seek_by_steps(-1)
      event.preventDefault()
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      seek_by_steps(1)
      event.preventDefault()
    }
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
