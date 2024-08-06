import { CodeEditor } from "~/components/editor/CodeEditor"
import { LoadingSpinner } from "~/components/ui/loading-spinner"
import { useRxSuspense, useRxValue } from "rx-solid"
import { Show, Suspense } from "solid-js"
import { importRx } from "~/lib/playground/rx"

export default function Playground() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading playground..." />}>
      <PlaygroundLoader />
    </Suspense>
  )
}

function PlaygroundLoader() {
  const workspaceSignal = useRxSuspense(importRx)
  return (
    <main class="relative flex flex-col size-full z-0">
      <Show
        when={(() => {
          const workspace = workspaceSignal()
          return workspace && workspace._tag === "Success" && workspace
        })()}
      >
        {(workspace) => <CodeEditor workspace={workspace().value} />}
      </Show>
    </main>
  )
}
