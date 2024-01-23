<script lang="ts">
  import { browser } from '$app/environment'
  import { visible } from './intersection-observer'
  // import { tick } from 'svelte'

  let main: HTMLDivElement

  const SM_BREAKPOINT = 640
  $: is_mobile = window_width < SM_BREAKPOINT
  // $: if (is_mobile) {
  //   tick().then(() => {
  //     scroll_to(main)
  //   })
  // }

  // function scroll_to(element: HTMLElement) {
  //   element.scrollIntoView({ behavior: 'instant' })
  // }

  let window_width: number
  let active_view: 'player' | 'study' | 'chat' = 'player'
</script>

<div class="h-50px"><slot name="header" /></div>
<div class="w-full snap-mandatory snap-x sm:snap-none flex overflow-y-hidden overflow-x-scroll sm:overflow-x-hidden max-w-90rem sm:mx-auto h-[calc(100vh-50px)]">
  <!-- {#if is_mobile}
    <div class="shrink-0 w-100vw h-100vh snap-start snap-always overflow-y-auto">
      <slot name="chat" />
    </div>
  {/if} -->

  <div bind:this={main} class="shrink-0 w-100vw sm:w-full snap-start snap-always flex flex-col sm:flex-row" use:visible={{threshold: 0.2}} on:observed={({detail: isIntersecting}) => {
    if (isIntersecting)
      active_view = 'player'
  }}>
    <div class="sm:w-50% flex flex-col sm:h-full">
      <slot name="player" />
      {#if browser && !is_mobile}
        <div class="grow-1 overflow-y-auto">
          <slot name="study" />
          <!-- <slot name="chat" /> -->
        </div>
      {/if}
    </div>
    <div class="sm:w-50% overflow-x-auto relative sm:pl-2 pt-2 sm:pt-0">
      <slot name="sentences" in_view={active_view === 'player'} />
    </div>
  </div>

  {#if is_mobile}
    <div class="shrink-0 w-100vw snap-start snap-always overflow-y-auto" use:visible={{threshold: 0.1}} on:observed={({detail: isIntersecting}) => {
      if (isIntersecting)
        active_view = 'study'
      else
        active_view = 'player'
    }}>
      <slot name="study" />
    </div>
  {/if}
</div>

<svelte:window bind:innerWidth={window_width}  />
