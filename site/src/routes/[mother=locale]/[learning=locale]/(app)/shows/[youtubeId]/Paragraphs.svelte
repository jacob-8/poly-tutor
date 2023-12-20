<script lang="ts">
  import type { CEDictEntry, Sentence } from '$lib/types'
  import { Button } from 'svelte-pieces'
  import { prepareSentences } from './prepareSentences'
  import { PlayerState } from './Youtube.svelte'
  // eslint-disable-next-line no-duplicate-imports
  import type Youtube from './Youtube.svelte'

  export let entries: Record<string, CEDictEntry>
  // export let paragraphs: Paragraph[] = []
  export let sentences: Sentence[] = []
  export let studySentence: (sentence: Sentence) => void

  export let currentTimeMs: number
  export let setTime: (ms: number) => void
  export let playerState: YT.PlayerState
  export let youtubeComponent: Youtube
  export let paddingMilliseconds = 250

  let loop_caption = false
  let stop_time_ms: number
  let start_time_ms: number
  let updated_play_position: Date | null = null
  let selected_caption_index = 0

  $: captions = prepareSentences(sentences, entries)

  $: is_playing = playerState === PlayerState.PLAYING || playerState === PlayerState.BUFFERING
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
          youtubeComponent.pause()
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
    return captions.findIndex(({ start_ms, end_ms }) => {
      const isAfterStart = current_milliseconds > start_ms
      const isBeforeEnd = current_milliseconds < end_ms
      return isAfterStart && isBeforeEnd
    })
  }

  $: scroll_to_caption(current_caption_index)

  function scroll_to_caption(index: number) {
    document.querySelector(`#caption_${index}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  function play({ start_ms, end_ms, index, loop }: { start_ms: number; end_ms?: number; index: number; loop?: boolean }) {
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
    studySentence(captions[index])
    current_caption_index = index
  // const url = new URL($page.url.toString())
    // url.searchParams.set(CAPTION_SEARCH_PARAM, index.toString())
    // window.history.replaceState({}, '', url.toString())
  }

  function start_player_at(time_ms: number) {
    start_time_ms = time_ms // set for loop mode
    youtubeComponent.seekToMs(time_ms - paddingMilliseconds)
    youtubeComponent.play()
  }

  function seekToPrevious() {
    current_caption_index = Math.max(0, current_caption_index - 1)
    const previousCaption = captions[current_caption_index]
    const end_ms = stop_time_ms ? previousCaption.end_ms : null
    if (is_playing)
      play({ start_ms: previousCaption.start_ms, index: current_caption_index, end_ms })
    else
      youtubeComponent.seekToMs(previousCaption.start_ms)

  }
  function seekToNext() {
    current_caption_index = Math.min(captions.length, current_caption_index + 1)
    const nextCaption = captions[current_caption_index]
    const end_ms = stop_time_ms ? nextCaption.end_ms : null
    if (is_playing)
      play({ start_ms: nextCaption.start_ms, index: current_caption_index, end_ms })
    else
      youtubeComponent.seekToMs(nextCaption.start_ms)

  }
  function playCaptionOnLoop() {
    const currentCaption = captions[current_caption_index]
    play({ start_ms: currentCaption.start_ms, index: current_caption_index, loop: true, end_ms: currentCaption.end_ms })
  }
  function playCaptionOnce() {
    const currentCaption = captions[current_caption_index]
    play({ start_ms: currentCaption.start_ms, index: current_caption_index, loop: false, end_ms: currentCaption.end_ms })
  }
  function playNormal() {
    const currentCaption = captions[current_caption_index]
    play({ start_ms: currentCaption.start_ms, index: current_caption_index, loop: false })
  }
</script>

{#each captions as sentence, index}
  {@const active = index === current_caption_index}
  <div
    id="caption_{index}"
    class="p-1 flex flex-wrap relative hover:bg-gray-100 rounded relative group"
    class:bg-gray-200={active}
    on:mouseover={() => studySentence(sentence)}
    on:click={() => {
      if (stop_time_ms)
        play({ start_ms: sentence.start_ms, index, end_ms: sentence.end_ms })
      else
        play({ start_ms: sentence.start_ms, index })
    }}>
    <div>{sentence.text}</div>
    <!-- <pre>{JSON.stringify(sentence, null, 2)}</pre> -->
    <!-- {#each sentence.words as {text, known, pronunciation}}
      <div class="flex flex-col" class:text-green-500={!known}>
        <div class="text-xs text-center text-gray h-10px group-hover:opacity-100" class:opacity-0={known}>
          {pronunciation.replace(' ', '')}
        </div>
        <div class="whitespace-nowrap">
          {text}
        </div>
      </div>
    {/each} -->
  </div>
{/each}

<div class="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex space-x-1">
  <div class="ml-auto" />
  {#if mode === 'repeat' && is_playing}
    <Button form="filled" color="black" onclick={() => youtubeComponent.pause()}>
      <span class="i-carbon-pause-filled text-xl" />
    </Button>
  {:else}
    <Button title="Repeat (shortcut: r)" form={mode === 'repeat' ? 'filled' : 'outline'} color="black" onclick={playCaptionOnLoop}>
      <span class="i-ic-baseline-loop text-xl" />
    </Button>
  {/if}
  {#if mode === 'play-once' && is_playing}
    <Button form="filled" color="black" onclick={() => youtubeComponent.pause()}>
      <span class="i-carbon-pause-filled text-xl" />
    </Button>
  {:else}
    <Button title="Play once (shortcut: 1)" form={mode === 'play-once' ? 'filled' : 'outline'} color="black" onclick={playCaptionOnce}>
      <div>1x</div>
    </Button>
  {/if}
  {#if mode === 'normal-play' && is_playing}
    <Button form="filled" color="black" onclick={() => youtubeComponent.pause()}>
      <span class="i-carbon-pause-filled text-xl" />
    </Button>
  {:else}
    <Button title="Play normal (shortcut: n)" form={mode === 'normal-play' ? 'filled' : 'outline'} color="black" onclick={playNormal}>
      <span class="i-carbon-play-filled-alt text-xl" />
    </Button>
  {/if}
  <Button title="Shortcut key: up or right-arrow" form="outline" color="black" onclick={seekToPrevious}>
    <span class="i-carbon-arrow-up text-xl" />
  </Button>
  <Button title="Shortcut key: down or left-arrow" form="outline" color="black" onclick={seekToNext}>
    <span class="i-carbon-arrow-down text-xl" />
  </Button>
</div>

<svelte:window
  on:keydown={(event) => {
    const SPACEBAR = ' '
    if (event.key === SPACEBAR) {
      if (is_playing)
        youtubeComponent.pause()
      else
        youtubeComponent.play()

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
    if (event.key === '1') {
      playCaptionOnce()
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
