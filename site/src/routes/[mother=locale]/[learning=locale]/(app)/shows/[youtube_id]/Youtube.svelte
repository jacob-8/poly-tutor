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
  import { fade } from 'svelte/transition'

  export let youtube_id: string
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
      videoId: youtube_id,
      playerVars: {
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        // cc_lang_pref: 'en', | 'zh'
        disablekb: 1,

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

  let first_time_playing = true

  export function seekToMs(ms: number) {
    const seconds = ms/ 1000
    if (first_time_playing && player)
      ignore_youtube_autoresume_location(seconds)
    player.seekTo(seconds, true)
  }

  function ignore_youtube_autoresume_location(seconds: number) {
    player.mute()
    const interval = setInterval(() => {
      if (state === PlayerState.PLAYING) {
        player.seekTo(seconds, true)
        player.unMute()
        clearInterval(interval)
      }
    }, 20)
    first_time_playing = false
  }

  export function setPlaybackRate(rate: number) {
    player.setPlaybackRate(rate)
  }

  export function play() {
    player.playVideo()
  }

  export function pause() {
    player.pauseVideo()
  }

  export function set_volume(volume: number) {
    player.setVolume(volume)
  }
</script>

<div class="responsive" style="view-transition-name: yt-thumbnail-{youtube_id}">
  {#if !error}
    {#if !player}
      <div out:fade={{delay: 500, duration: 500}} class="bg-no-repeat absolute inset-0 bg-cover z-1" style="background-color: black; background-image: url(https://i.ytimg.com/vi/{youtube_id}/sddefault.jpg); background-position: center;" />
    {:else if state === PlayerState.PLAYING}
      <div class="absolute inset-0 z-1" on:click={() => player.pauseVideo()} />
    {/if}
    <div id="player" class="bg-black" />
  {:else}
    <div style="text-align: center; margin-top: 20px;">
      YouTube Playback Error {error}: {errorExplanation}
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
