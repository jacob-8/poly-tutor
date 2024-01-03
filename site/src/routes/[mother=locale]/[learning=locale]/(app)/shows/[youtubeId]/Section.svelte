<script lang="ts">
  import type { Sentence } from '$lib/types'
  import Sentences from './Sentences.svelte'
  import { page } from '$app/stores'
  import { Button } from 'svelte-pieces'
  import type Youtube from './Youtube.svelte'

  export let sentences: Sentence[]
  export let studySentence: (sentence: Sentence) => void
  export let transcribe_captions: () => Promise<void>
  export let currentTimeMs: number
  export let isPlaying: boolean
  export let youtubeComponent: Youtube
</script>

<div class="pb-20">
  {#if sentences}
    <Sentences
      play={youtubeComponent.play}
      pause={youtubeComponent.pause}
      seekToMs={youtubeComponent.seekToMs}
      {isPlaying} {currentTimeMs} {studySentence} {sentences} />
  {:else}
    <div class="text-base">
      <Button size="lg" class="mt-2" onclick={() => transcribe_captions()}>{$page.data.t.shows.get_captions}</Button>
      <!-- TODO: show price -->
    </div>
  {/if}
</div>
