import type { Action } from 'svelte/action'

export const visible: Action<HTMLDivElement, { threshold?: number | number[], rootMargin?: string }, { 'on:observed': (e: CustomEvent<boolean>) => void }> = (node, settings) => {
  const threshold = settings?.threshold || 0
  const rootMargin = settings?.rootMargin || '0px'

  if (typeof IntersectionObserver === 'undefined')
    return alert('no intersection observer - please use a modern browser')

  const observer = new IntersectionObserver(([{isIntersecting}]) => {
    node.dispatchEvent(new CustomEvent('observed', { detail: isIntersecting }))
  },
  {
    threshold,
    rootMargin,
  })
  observer.observe(node)

  return {
    destroy() {
      observer.unobserve(node)
    }
  }
}

// Usage example
// use:visible={{threshold: 0.5}} on:observed={({detail}) => console.log({detail})}
