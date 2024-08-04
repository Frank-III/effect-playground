import * as Solid from "solid-js"
import { RxWorkspaceHandle } from "../rx/workspace"
import { useRxSet, useRxValue } from "rx-solid"

export const WorkspaceContext = Solid.createContext<RxWorkspaceHandle>(
  null as any
)

export const useWorkspaceHandle = () => {
  const context = Solid.useContext(WorkspaceContext)
  if (!context) {
    throw new Error("WorkspaceProvider not found")
  }
  return context
}

export const useWorkspaceRx = () => useWorkspaceHandle().workspace

export const useWorkspace = () => useRxValue(useWorkspaceRx())
export const useSetWorkspace = () => useRxSet(useWorkspaceRx())

export const useWorkspaceShells = () => useRxValue(useWorkspaceRx(), (workspace) => workspace.shells)

export const useWorkspaceTree = () => useRxValue(useWorkspaceRx(), (workspace) => workspace.tree)
