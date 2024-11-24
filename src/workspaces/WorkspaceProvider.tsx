import { Result, createRxSuspense } from "rx-solid"
import { WorkspaceContext } from "./context/workspace"
import { Workspace } from "./domain/workspace"
import { workspaceHandleRx } from "./rx/workspace"
import { ParentComponent, Show } from "solid-js"

export const WorkspaceProvider: ParentComponent<{ workspace: Workspace }> = (
  props
) => {
  const handle = createRxSuspense(workspaceHandleRx(props.workspace))
  return (
    <Show
      when={(() => {
        const handleRes = handle()
        return handleRes && handleRes._tag === "Success" && handleRes
      })()}
      fallback={<div>loading</div>}
    >
      {(handle) => (
        <WorkspaceContext.Provider value={handle().value}>
          {props.children}
        </WorkspaceContext.Provider>
      )}
    </Show>
  )
}
