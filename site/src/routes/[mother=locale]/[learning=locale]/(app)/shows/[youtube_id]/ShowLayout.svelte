<script lang="ts">
  import { browser } from '$app/environment'
  import { visible } from './intersection-observer'
  import { tick } from 'svelte'
  import { SplitPane } from 'svelte-pieces'

  let main: HTMLDivElement
  let chat: HTMLDivElement
  let study: HTMLDivElement

  const SM_BREAKPOINT = 640
  $: is_mobile = window_width < SM_BREAKPOINT
  $: if (is_mobile) {
    tick().then(() => {
      scroll_to_main()
    })
  }

  function scroll_to(element: HTMLElement) {
    element?.scrollIntoView({ behavior: 'instant' })
  }

  let window_width: number
  let active_view: 'main' | 'study' | 'chat' = 'main'

  function scroll_to_main() {
    scroll_to(main)
  }

  function scroll_to_chat() {
    scroll_to(chat)
  }

  function scroll_to_study() {
    scroll_to(study)
  }
</script>

<div class="w-full h-full snap-mandatory snap-x sm:snap-none flex overflow-y-hidden overflow-x-scroll sm:overflow-x-hidden max-w-90rem sm:mx-auto sm:px-2">
  {#if is_mobile}
    <div bind:this={chat} class="shrink-0 w-100vw h-100vh snap-start snap-always flex flex-col" use:visible={{threshold: 0.1}} on:observed={({detail: isIntersecting}) => {
      if (isIntersecting)
        active_view = 'chat'
      else
        active_view = 'main'
    }}>
      <div class="h-50px order-last sm:order-first">
        <slot name="chat-header" {scroll_to_main} />
      </div>
      <div class="h-[calc(100vh-50px)] h-[calc(100dvh-50px)]! overflow-y-auto">
        <slot name="chat" />
      </div>
    </div>
  {/if}

  <div bind:this={main} class="shrink-0 w-100vw sm:w-full h-100vh snap-start snap-always flex flex-col" use:visible={{threshold: 0.2}} on:observed={({detail: isIntersecting}) => {
    if (isIntersecting)
      active_view = 'main'
  }}>
    <div class="h-50px order-last sm:order-first">
      <slot name="header" {scroll_to_study} {scroll_to_chat} />
    </div>
    <div class="h-[calc(100vh-50px)] h-[calc(100dvh-50px)]!">
      {#if browser && !is_mobile}
        <SplitPane pos={50}>
          <div slot="a" class="flex flex-col h-full relative">
            <slot name="player" />
            <div class="grow-1 overflow-y-auto">
              <slot name="sentences" in_view={active_view === 'main'} {scroll_to_study} />
            </div>
          </div>

          <div slot="b" class="h-full overflow-y-auto relative">
            <SplitPane type="vertical" pos={50}>
              <svelte:fragment slot="a"><slot name="study" /></svelte:fragment>
              <svelte:fragment slot="b"><slot name="chat" /></svelte:fragment>
            </SplitPane>
          </div>
        </SplitPane>
      {:else}
        <div class="flex flex-col relative h-full grow-1 sm:hidden">
          <slot name="player" />
          <div class="grow-1 overflow-y-auto">
            <slot name="sentences" in_view={active_view === 'main'} {scroll_to_study} />
          </div>
        </div>
      {/if}
    </div>
  </div>

  {#if is_mobile}
    <div bind:this={study} class="shrink-0 w-100vw h-100vh snap-start snap-always flex flex-col" use:visible={{threshold: 0.1}} on:observed={({detail: isIntersecting}) => {
      if (isIntersecting)
        active_view = 'study'
      else
        active_view = 'main'
    }}>
      <div class="h-50px order-last sm:order-first">
        <slot name="study-header" {scroll_to_main} />
      </div>
      <div class="h-[calc(100vh-50px)] h-[calc(100dvh-50px)]! overflow-y-auto">
        <slot name="study" />
      </div>
    </div>
  {/if}
</div>

<svelte:window bind:innerWidth={window_width}  />
