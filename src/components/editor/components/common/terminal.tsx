import { Icon } from "~/components/icons"
import { Result, useRxSet, useRxSuspense } from "rx-solid"
import "@xterm/xterm/css/xterm.css"
// import "./terminal.css";
import { WorkspaceShell } from "~/workspaces/domain/workspace"
import {
  useWorkspaceHandle,
  useWorkspaceRx,
  useWorkspaceShells
} from "~/workspaces/context/workspace"
import { createEffect, createMemo, createSignal, Suspense } from "solid-js"
import { Terminal as XTerm } from "@xterm/xterm"

export function Terminal({ shell }: { readonly shell: WorkspaceShell }) {
  return (
    <div class="relative z-0 h-full flex flex-col">
      <Suspense fallback={null}>
        <div class="flex-1 overflow-hidden">
          <Shell shell={shell} />
        </div>
      </Suspense>
    </div>
  )
}

function Shell({ shell }: { readonly shell: WorkspaceShell }) {
  const [ref, setRef] = createSignal<HTMLDivElement>()
  const handle = useWorkspaceHandle()
  const rx = createMemo(() => handle.terminal(shell))
  const terminal = useRxSuspense(rx())

  createEffect(() => {
    const terminalRes = terminal()
    if (terminalRes && terminalRes?._tag === "Success") {
      terminalRes.value.open(ref()!)
    }
  })

  return <div ref={setRef} id="terminal" class="h-full" />
}

function AddRemoveButton({ shell }: { readonly shell: WorkspaceShell }) {
  const workspace = useWorkspaceRx()
  const setWorkspace = useRxSet(workspace)
  const shells = useWorkspaceShells()

  //TODO: fix this when I have the time on rx-solid
  const addShell = () => {
    setWorkspace((workspace) => workspace.addShell(new WorkspaceShell({})))
  }

  const removeShell = () => {
    setWorkspace((workspace) => workspace.removeShell(shell))
    //}
  }

  if (shells()[0] === shell) {
    if (shells.length > 1) return null
    return (
      <button type="button" onClick={addShell}>
        <Icon name="plus" class="h-4" />
      </button>
    )
  }

  return (
    <button type="button" onClick={removeShell}>
      <Icon name="close" class="h-4" />
    </button>
  )
}
