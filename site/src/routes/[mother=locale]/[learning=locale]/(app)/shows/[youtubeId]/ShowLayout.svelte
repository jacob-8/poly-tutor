<script lang="ts">
  import { browser } from '$app/environment'
  import { tick } from 'svelte'

  let main_element: HTMLDivElement
  let is_mobile = false

  $: if (window_width < 640) {
    is_mobile = true
    tick().then(() => {
      main_element.scrollIntoView({ behavior: 'instant'})
    })
  } else {
    is_mobile = false
  }

  let window_width: number

// import type { Action } from 'svelte/action'
  // const visible: Action<HTMLDivElement, undefined, { 'on:observed': (e: CustomEvent<boolean>) => void }> = (node) => {
  //   if (typeof IntersectionObserver === 'undefined')
  //     return alert('no intersection observer - please use a modern browser')

  //   const observer = new IntersectionObserver(([{isIntersecting}]) => {
  //     node.dispatchEvent(new CustomEvent('observed', { detail: isIntersecting }))
  //   },
  //     {
  //       // rootMargin: '0px',
  //       threshold: 1,
  //     })
  //   observer.observe(node)

  //   return {
  //     destroy() {
  //       observer.unobserve(node)
  //     }
  //   }
  // }
  // use:visible on:observed={({detail}) => study_view_visible = detail}
</script>


<div class="w-full snap-mandatory snap-x sm:snap-none flex overflow-y-hidden overflow-x-scroll sm:overflow-x-hidden max-w-90rem sm:mx-auto">
  <!-- {#if is_mobile}
    <div class="shrink-0 w-100vw h-100vh snap-start snap-always overflow-y-auto">
      <slot name="chat" />
    </div>
  {/if} -->
  <div bind:this={main_element} class="shrink-0 w-100vw sm:w-full h-100vh snap-start snap-always flex flex-col sm:flex-row">
    <div class="sm:w-50% flex flex-col sm:h-full">
      <slot name="player" />
      {#if browser && !is_mobile}
        <div class="grow-1 overflow-y-auto">
          <slot name="study" />
          <!-- <slot name="chat" /> -->
        </div>
      {/if}
    </div>
    <div class="sm:w-50% overflow-x-auto relative sm:pl-2">
      <slot name="sentences" />
    </div>
  </div>
  {#if is_mobile}
    <div class="shrink-0 w-100vw h-100vh snap-start snap-always overflow-y-auto">
      <slot name="study" />
    </div>
  {/if}
</div>

<svelte:window bind:innerWidth={window_width}  />
