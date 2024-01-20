<script lang="ts">
  import type { Sentence, Settings, StudyWordsObject, UserVocabulary } from '$lib/types'
  import SentenceComponent from '$lib/components/Sentence.svelte'
  import { portal } from './portal'

  export let sentences: Sentence[] = []
  export let study_words_object: StudyWordsObject
  export let changed_words: UserVocabulary = {}
  export let studySentence: (sentence: Sentence) => void
  export let settings: Settings
  export let currentTimeMs: number
  export let isPlaying: boolean
  export let paddingMilliseconds = 250
  export let play: () => void
  export let pause: () => void
  export let seekToMs: (ms: number) => void
  export let add_seen_sentence: (words: string[]) => void

  let loop_caption = false
  let stop_time_ms: number
  let start_time_ms: number
  let updated_play_position: Date | null = null
  let selected_caption_index = 0

  let current_caption_index = 0
  let mode: 'repeat' | 'play-once' | 'normal-play'
  $: mode = (() => {
    if (loop_caption)
      return 'repeat'
    if (stop_time_ms)
      return 'play-once'
    return 'normal-play'
  })()

  $: watch_time(currentTimeMs)

  function watch_time(time_ms: number) {
    if (stop_time_ms) {
      if (time_ms >= stop_time_ms + paddingMilliseconds) {
        if (loop_caption)
          start_player_at(start_time_ms)
        else
          pause()
      }
      return
    }

    const user_updated_position = updated_play_position && Date.now() - updated_play_position.getTime() < 2000
    if (user_updated_position)
      return

    update_current_index_when_needed(time_ms)
  }

  function update_current_index_when_needed(current_time_ms: number) {
    const index = find_caption_index_by_time(current_time_ms)
    const is_not_previous_to_selected = index >= selected_caption_index
    if (index > -1 && is_not_previous_to_selected)
      set_current_caption_index(index)
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

  function play_and_select({ start_ms, end_ms, index, loop }: { start_ms: number; end_ms?: number; index: number; loop?: boolean }) {
    updated_play_position = new Date()
    if (typeof loop === 'boolean')
      loop_caption = loop // don't change loop mode if undefined
    start_player_at(start_ms)
    select_caption(index)
    stop_time_ms = end_ms || null
  }

  function select_caption(index: number) {
    selected_caption_index = index
    set_current_caption_index(index)
  }

  function set_current_caption_index(index: number) {
    studySentence(sentences[index])
    current_caption_index = index
  // const url = new URL($page.url.toString())
    // url.searchParams.set(CAPTION_SEARCH_PARAM, index.toString())
    // window.history.replaceState({}, '', url.toString())
  }

  function start_player_at(time_ms: number) {
    start_time_ms = time_ms // set for loop mode
    seekToMs(time_ms - paddingMilliseconds)
    play()
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
    const currentCaption = sentences[current_caption_index]
    play_and_select({ start_ms: currentCaption.start_ms, index: current_caption_index, loop: true, end_ms: currentCaption.end_ms })
  }
  // function playCaptionOnce() {
  //   const currentCaption = sentences[current_caption_index]
  //   play_and_select({ start_ms: currentCaption.start_ms, index: current_caption_index, loop: false, end_ms: currentCaption.end_ms })
  // }
  function playNormal() {
    const currentCaption = sentences[current_caption_index]
    play_and_select({ start_ms: currentCaption.start_ms, index: current_caption_index, loop: false })
  }
</script>

{#each sentences as sentence, index}
  <SentenceComponent {changed_words} {add_seen_sentence} {study_words_object} id="caption_{index}" {settings} {sentence} active={index === current_caption_index}
    onClick={() => {
      play_and_select({ start_ms: sentence.start_ms, index, end_ms: stop_time_ms ? sentence.end_ms : null })
    }} />
{/each}

<div class="contents" use:portal={'#playback-controls'}>
  <!-- {#if mode === 'play-once' && isPlaying}
  <button type="button" class="active" on:click={pause}>
    <span class="i-carbon-pause-filled text-xl" />
  </button>
{:else}
  <button type="button" title="Play once (shortcut: 1)" class:active={mode === 'play-once'} on:click={playCaptionOnce}>
    <div>1x</div>
  </button>
{/if} -->
  {#if mode === 'repeat' && isPlaying}
    <button type="button" class="active" on:click={pause}>
      <span class="i-carbon-pause-filled text-xl" />
    </button>
  {:else}
    <button type="button" title="Repeat (shortcut: r)" class:active={mode === 'repeat'} on:click={playCaptionOnLoop}>
      <span class="i-ic-baseline-loop text-xl" />
    </button>
  {/if}
  {#if mode === 'normal-play' && isPlaying}
    <button type="button" class="active" on:click={pause}>
      <span class="i-carbon-pause-filled text-xl" />
    </button>
  {:else}
    <button type="button" title="Play normal (shortcut: n)" class:active={mode === 'normal-play'} on:click={playNormal}>
      <span class="i-carbon-play-filled-alt text-xl" />
    </button>
  {/if}
  <!-- <button type="button" class="hidden! sm:flex!" title="Shortcut key: up or right-arrow" on:click={seekToPrevious}>
  <span class="i-carbon-arrow-up text-xl" />
</button>
<button type="button" class="hidden! sm:flex!" title="Shortcut key: down or left-arrow" on:click={seekToNext}>
  <span class="i-carbon-arrow-down text-xl" />
</button> -->
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
