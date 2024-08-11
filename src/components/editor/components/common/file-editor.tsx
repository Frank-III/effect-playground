import { LoadingSpinner } from "~/components/ui/loading-spinner"
import { cn } from "~/lib/utils"
import { useRxSet, useRxValue } from "rx-solid"
import * as Option from "effect/Option"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import { useWorkspaceHandle } from "~/workspaces/context/workspace"
import { editorRx } from "../../rx"
import {
  batch,
  createEffect,
  createMemo,
  createSignal,
  Match,
  onMount,
  Switch
} from "solid-js"

export function FileEditor() {
  const handle = useWorkspaceHandle()
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement>()
  const rx = editorRx(handle)
  const setElement = useRxSet(rx.element)
  const result = useRxValue(rx.editor)
  const isReady = createMemo(() => result()._tag === "Success")
  const isError = () => result()._tag === "Failure"

  // onMount(() => {
  //   self.MonacoEnvironment = {
  //     getWorker: function (_: any, label: string) {
  //       if (label === "json") {
  //         return new jsonWorker()
  //       }
  //       if (label === "css" || label === "scss" || label === "less") {
  //         return new cssWorker()
  //       }
  //       if (label === "html" || label === "handlebars" || label === "razor") {
  //         return new htmlWorker()
  //       }
  //       if (label === "typescript" || label === "javascript") {
  //         return new tsWorker()
  //       }
  //       return new editorWorker()
  //     }
  //   }
  // })

  return (
    <section class="h-full flex flex-col">
      <Switch>
        <Match when={isError()}>
          <p>Failed</p>
          {result().cause}
        </Match>
        <Match when={!isReady()}>
          <LoadingSpinner message="Loading editor..." />
        </Match>
      </Switch>
      <div
        ref={(el) => {
          batch(() => {
            setContainerRef(el)
            setElement(Option.some(el))
          })
        }}
        class={cn("h-full", !isReady() && "hidden")}
      />
    </section>
  )
}
