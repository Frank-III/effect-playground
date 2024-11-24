import { LoadingSpinner } from "~/components/ui/loading-spinner"
import { cn } from "~/lib/utils"
import { createRxSet, createRxValue } from "rx-solid"
import * as Option from "effect/Option"
import { useWorkspaceHandle } from "~/workspaces/context/workspace"
import { editorRx } from "../../rx"
import {
  createEffect,
  createMemo,
  createSignal,
  Match,
  Switch
} from "solid-js"

export function FileEditor() {
  const handle = useWorkspaceHandle()
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement>()
  const rx = createMemo(() => editorRx(handle))
  const setElement = createRxSet(rx().element)
  const result = createRxValue(rx().editor)
  const isReady = () => result()._tag === "Success"
  const isError = () => result()._tag === "Failure"

  createEffect(() => {
    if (containerRef()) {
      setElement(Option.some(containerRef()!))
    }
  })

  return (
    <section class="h-full flex flex-col">
      <Switch>
        <Match when={isError()}>
          <p>Failed</p>
        </Match>
        <Match when={!isReady()}>
          <LoadingSpinner message="Loading editor..." />
        </Match>
      </Switch>
      <div
        ref={(el) => setContainerRef(el)}
        class={cn("h-full", !isReady && "hidden")}
      />
    </section>
  )
}
