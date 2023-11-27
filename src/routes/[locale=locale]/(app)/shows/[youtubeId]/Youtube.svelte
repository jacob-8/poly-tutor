<script context="module" lang="ts">
  export const PlayerState = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
  }

  let iframeApiReady = false

  if (typeof window !== 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)

    //@ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      window.dispatchEvent(new Event('iframeApiReady'))
      iframeApiReady = true
    }
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'

  export let videoId: string
  export let playbackRate: number
  export let readState: (state: YT.PlayerState) => void
  export let readCurrentTime: (ms: number) => void

  let player: YT.Player
  let error: YT.PlayerError
  let errorExplanation: string
  let state: YT.PlayerState

  const MILLISECONDS_BETWEEN_TIME_CHECKS = 20
  let interval: number

  onMount(() => {
    iframeApiReady ? initPlayer() : window.addEventListener('iframeApiReady', initPlayer)
    return () => {
      player?.destroy()
      interval && clearInterval(interval)
    }
  })

  function initPlayer() {
    player = new YT.Player('player', {
      videoId,
      playerVars: {
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
      },
      events: {
        onReady: (e) => {
          state = e.target.getPlayerState()
          readState(state)
          playbackRate = e.target.getPlaybackRate()
          interval = window.setInterval(() => {
            readCurrentTime(player.getCurrentTime() * 1000)
          }, MILLISECONDS_BETWEEN_TIME_CHECKS)
        },
        onError: (e) => {
          error = e.data
          errorExplanation = Object.keys(YT.PlayerError).find(
            (key) => YT.PlayerError[key] === error
          )
        },
        onStateChange: (e) => {
          state = e.data
          readState(state)
        },
      },
    })
  }

  export function setPlaybackRate(rate: number) {
    player.setPlaybackRate(rate)
  }

  export function seekToMs(ms: number) {
    player.seekTo(ms / 1000, true)
  }

  export function play() {
    player.playVideo()
  }

  export function pause() {
    player.pauseVideo()
  }
</script>

<div class="responsive">
  {#if !error}
    <div id="player" />
  {:else}
    <div style="text-align: center; margin-top: 20px;">
      Playback Error {error}: {errorExplanation}
    </div>
  {/if}
</div>

<style>
  .responsive {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    max-width: 100%;
  }

  :global(.responsive iframe),
  :global(.responsive object),
  :global(.responsive embed) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
