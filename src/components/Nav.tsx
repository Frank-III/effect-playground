import { useLocation } from "@solidjs/router"
import { ModeToggle } from "./dark-toggle"

export default function Nav() {
  const location = useLocation()
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600"
  return (
    <nav class="flex flex-row bg-sky-800 items-center justify-between">
      <ul class="container flex items-center p-3 text-gray-200">
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6 `}>
          <a href="/">Home</a>
        </li>
        <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
          <a href="/about">About</a>
        </li>
        <li class={`border-b-2 ${active("/playground")} mx-1.5 sm:mx-6`}>
          <a href="/playground">Playground</a>
        </li>
        <li class={`border-b-2 ${active("/resizable")} mx-1.5 sm:mx-6`}>
          <a href="/resizable">Resizable</a>
        </li>
      </ul>
      {/* <ModeToggle /> */}
    </nav>
  )
}
