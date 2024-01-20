export function portal(node: HTMLElement, target = 'body') {
  const parent = document.querySelector(target)
  parent.appendChild(node)

  return {
    destroy() {
      parent.removeChild(node)
    },
  }
}
