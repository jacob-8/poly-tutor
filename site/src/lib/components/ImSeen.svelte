<script lang="ts" context="module">
  let observer: IntersectionObserver
  const mapping = new Map()

  function add(element: HTMLElement, callback: (isIntersecting: boolean) => void) {
    mapping.set(element, callback)
    observer.observe(element)
  }

  function remove(element: HTMLElement) {
    const deleted = mapping.delete(element)
    deleted && observer.unobserve(element)
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  export let i_am_seen: () => void = undefined
  export let milliseconds = 10000

  let element: HTMLElement
  let visibilityTimer: ReturnType<typeof setTimeout>

  onMount(() => {
    if (typeof IntersectionObserver === 'undefined') return

    if (!observer) {
      const rootMargin = `0px 0px 20px 0px`

      observer = new IntersectionObserver(
        (entries) => {
          for (var entry of entries) {
            const callback = mapping.get(entry.target)
            callback && callback(entry.isIntersecting)
          }
        },
        {
          rootMargin,
        },
      )
    }

    const fired_when_interesecting_changes = (isIntersecting: boolean) => {
      if (isIntersecting) {
        visibilityTimer = setTimeout(() => {
          i_am_seen()
          remove(element)
        }, milliseconds)
      } else {
        clearTimeout(visibilityTimer)
      }
    }

    add(element, fired_when_interesecting_changes)

    return () => {
      remove(element)
      clearTimeout(visibilityTimer)
    }
  })
</script>

<div bind:this={element} style="height: 0; width: 0" />
