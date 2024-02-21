/** Usage: use:scrollIntoView={{active, options: { block: 'center', behavior: 'smooth' }}} */
export function scrollIntoView(node: HTMLDivElement, { active, options }: { active: boolean, options: ScrollIntoViewOptions}) {
  if (active)
    node.scrollIntoView(options)
  return {
    update({ active: newActive, options: newOptions }) {
      if (newActive)
        node.scrollIntoView(newOptions)
    },
  }
}

