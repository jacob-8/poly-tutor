export function portal(node: HTMLElement, target = 'body') {
  const portal = document.createElement('div')
  portal.style.display = 'contents'
  document.querySelector(target).appendChild(portal)
  portal.appendChild(node)

  return {
    destroy() {
      portal.parentElement.removeChild(portal)
    },
  }
}
