<script lang="ts">
  import type { Sentence, Settings, StudyWordsObject, UserVocabulary } from '$lib/types'
  import SentenceComponent from '$lib/components/Sentence.svelte'
  import { portal } from './portal'
  import type { LanguageCode, LocaleCode } from '$lib/i18n/locales'
  import { speech } from '$lib/utils/speak'
  import { combine_short_sentences } from './combine-short-sentences'
  import { onMount } from 'svelte'

  export let language: LanguageCode
  export let mother: LocaleCode
  export let sentences: Sentence[] = []
  export let study_words_object: StudyWordsObject
  export let changed_words: UserVocabulary = {}
  export let studySentence: (sentence: Sentence) => void
  export let settings: Settings
  export let current_time_ms: number
  export let isPlaying: boolean
  export let play: () => void
  export let pause: () => void
  export let set_volume: (volume: number) => void
  export let seekToMs: (ms: number) => void
  export let add_seen_sentence: (words: string[]) => void
  export let jump_to_chapter_by_time: (current_time_ms: number) => boolean
  export let in_view: boolean
  export let is_last_chapter: boolean
  export let padding_ms = 250
  const volume_change_duration_ms = 500

  const COMBINE_IF_LESS_THAN_MS = 2000
  $: captions = combine_short_sentences({sentences, minimum_ms: COMBINE_IF_LESS_THAN_MS, mother})

  $: translation_volume = mother === 'en' ? 0.6 : 0.8

  let mode: 'normal' | 'repeat' | 'bilingual' = 'normal'
  let bilingual_loop_back = false

  let current_caption_index: number
  let current_caption: Sentence

  let intentionally_updated_at: number | null = null
  let intentionally_updated_to_index: number
  let read_translation_for_caption: number
  let is_reading_translation = false
  let stop_reading_translation: () => void

  onMount(() => {
    current_caption_index = 0
    current_caption = null
  })

  $: watch_time(current_time_ms)

  function watch_time(time_ms: number) {
    if (is_reading_translation) return

    if (mode === 'repeat') {
      if (time_ms > current_caption.end_ms + padding_ms)
        start_player_at(current_caption.start_ms)
      return
    }

    update_current_index_when_needed(time_ms)
  }

  function update_current_index_when_needed(time_ms: number) {
    const time_based_caption_index = find_caption_index_by_time(time_ms)
    if (current_caption_index === time_based_caption_index) return

    if (intentionally_updated_to_index === time_based_caption_index + 1) // don't jump back 1 when intentionally updating with a YouTube load delay - may allow for phasing out next line
      return

    if (intentionally_updated_at) {
      const recently_updated_position = ( Date.now() - intentionally_updated_at ) < ( padding_ms + 1750 )
      if (recently_updated_position) return
    }

    if (mode === 'bilingual') {
      const next_caption = captions[current_caption_index + 1]

      if (isPlaying && !next_caption && !is_last_chapter) {
        pause_and_reset_bilingual()
        const text = mother === 'en' ? 'End of chapter. Review unknown words.' : '本章结束。复习生词。'
        const { speak } = speech({ text, rate: 1.2, locale: mother, volume: translation_volume})
        speak()
        return
      }

      if (next_caption && time_ms > current_caption.end_ms - padding_ms && time_ms < next_caption.end_ms) {
        if (read_translation_for_caption !== current_caption_index)
          return read_translation(current_caption_index)
      }
    }

    if (time_based_caption_index === -1) {
      const jumped = jump_to_chapter_by_time(time_ms)
      if (jumped) return

      const playing_prior_to_first_caption = time_ms < captions[0]?.start_ms
      if (playing_prior_to_first_caption)
        set_current_caption_index(0)

      return
    }

    set_current_caption_index(time_based_caption_index)
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  function read_translation(index_to_read_translation: number) {
    const caption = captions[index_to_read_translation]

    is_reading_translation = true
    ease_volume({from: 100, to: 0, duration_ms: volume_change_duration_ms})
    const { speak, stop } = speech({ text: caption.translation?.[mother], rate: 1.2, locale: mother, volume: translation_volume})
    stop_reading_translation = stop
    speak().then(async () => {
      stop_reading_translation = null
      if (bilingual_loop_back) {
        seekToMs(caption.start_ms - volume_change_duration_ms)
      } else {
        seekToMs(caption.end_ms - volume_change_duration_ms)
        set_current_caption_index(index_to_read_translation + 1)
      }
      await ease_volume({from: 0, to: 100, duration_ms: volume_change_duration_ms})
      intentionally_updated_at = Date.now()
      read_translation_for_caption = index_to_read_translation
    }).catch(async () => {
      stop_reading_translation = null
      await ease_volume({from: 0, to: 100, duration_ms: volume_change_duration_ms / 2})
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
    return captions.findIndex(({ start_ms, end_ms }) => {
      const isAfterStart = current_milliseconds > start_ms
      const isBeforeEnd = current_milliseconds < end_ms
      return isAfterStart && isBeforeEnd
    })
  }

  function user_wants_to_play_new_location({ start_ms, index }: { start_ms: number; index: number }) {
    pause_and_reset_bilingual()
    intentionally_updated_to_index = index
    start_player_at(start_ms)
    set_current_caption_index(index)
  }

  function set_current_caption_index(index: number) {
    current_caption_index = index
    current_caption = captions[index]
    studySentence(current_caption)
  // const url = new URL($page.url.toString())
    // url.searchParams.set(CAPTION_SEARCH_PARAM, index.toString())
    // window.history.replaceState({}, '', url.toString())
  }

  function start_player_at(time_ms: number) {
    seekToMs(time_ms - padding_ms)
    play()
  }

  function seek_by_steps(steps: number) {
    current_caption_index = Math.max(0, current_caption_index + steps) // +1 for next and -1 for previous
    current_caption = captions[current_caption_index]
    if (isPlaying) {
      user_wants_to_play_new_location({ start_ms: current_caption.start_ms, index: current_caption_index })
    } else {
      seekToMs(current_caption.start_ms)
      studySentence(current_caption)
    }
  }
  function playCaptionOnLoop() {
    if (mode === 'repeat' && isPlaying) return pause()
    mode = 'repeat'
    current_caption = captions[current_caption_index]
    user_wants_to_play_new_location({ start_ms: current_caption.start_ms, index: current_caption_index })
  }
  function playBilingual(loop_back: boolean) {
    if (mode === 'bilingual' && bilingual_loop_back === loop_back && isPlaying) return pause_and_reset_bilingual()
    mode = 'bilingual'
    bilingual_loop_back = loop_back
    current_caption = captions[current_caption_index]
    user_wants_to_play_new_location({ start_ms: current_caption.start_ms, index: current_caption_index })
  }
  function playNormal() {
    if (mode === 'normal' && isPlaying) return pause()
    mode = 'normal'
    current_caption = captions[current_caption_index]
    user_wants_to_play_new_location({ start_ms: current_caption.start_ms, index: current_caption_index })
  }

  let paused_for_study = false
  $: if (isPlaying && !in_view) {
    pause_and_reset_bilingual()
    paused_for_study = true
  }
  $: if (paused_for_study && in_view) {
    play()
    paused_for_study = false
  }

  function pause_and_reset_bilingual() {
    pause()
    stop_reading_translation?.()
    // is_reading_translation = false
    read_translation_for_caption = null
    intentionally_updated_at = Date.now()
  }
</script>

{#each captions as sentence, index}
  <SentenceComponent {language} {changed_words} {add_seen_sentence} playing={isPlaying} {study_words_object} {settings} {sentence} active={index === current_caption_index} show={index < current_caption_index}
    ontouch={() => studySentence(captions[index])}
    onclick={() => user_wants_to_play_new_location({ start_ms: sentence.start_ms, index })} />
{/each}

<div class="contents" use:portal={'#playback-controls'}>
  <button type="button" title="Bilingual (shortcut: b)" class:playing={isPlaying} class:active={mode === 'bilingual' && !bilingual_loop_back} on:click={() => playBilingual(false)}>
    <span class="i-ri-translate text-xl" />
  </button>
  <button type="button" title="Bilingual with loop-back (shortcut: b)" class:playing={isPlaying} class:active={mode === 'bilingual' && bilingual_loop_back} on:click={() => playBilingual(true)}>
    <span class="i-ri-translate text-xl" />
    <span class="text-xs -mt-2">2</span>
  </button>
  <button type="button" title="Repeat (shortcut: r)" class:playing={isPlaying} class:active={mode === 'repeat'} on:click={playCaptionOnLoop}>
    <span class="i-ic-baseline-loop text-xl" />
  </button>
  <button type="button" title="Play normal (shortcut: n)" class:playing={isPlaying} class:active={mode === 'normal'} on:click={playNormal}>
    <span class="i-carbon-play-filled-alt text-xl" />
  </button>
</div>

<svelte:window
  on:keydown={(event) => {
    const SPACEBAR = ' '
    if (event.key === SPACEBAR) {
      if (isPlaying)
        pause_and_reset_bilingual()
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
      playBilingual(isPlaying ? !bilingual_loop_back: bilingual_loop_back)
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
    --at-apply: border border-black hover:bg-black/70 hover:text-white;
  }
  .active.playing {
    --at-apply: bg-black hover:bg-black/70 text-white;
  }
</style>
