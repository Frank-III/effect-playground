import { Accessor, onCleanup, onMount } from "solid-js"

export function useClickOutside(
  ref: Accessor<HTMLElement | undefined>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  const listener = (event: MouseEvent | TouchEvent) => {
    const element = ref()
    if (!element || element.contains(event.target as Node)) {
      return
    }
    handler(event)
  }

  onMount(() => {
    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)
  })

  onCleanup(() => {
    document.removeEventListener("mousedown", listener)
    document.removeEventListener("touchstart", listener)
  })
}
