import * as Solid from "solid-js"
import { RxWorkspaceHandle } from "../rx/workspace"
import { createRxSet, createRxValue } from "rx-solid"

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

export const useWorkspace = () => createRxValue(useWorkspaceRx())
export const useSetWorkspace = () => createRxSet(useWorkspaceRx())

export const useWorkspaceShells = () => createRxValue(useWorkspaceRx(), (workspace) => workspace.shells)

export const useWorkspaceTree = () => createRxValue(useWorkspaceRx(), (workspace) => workspace.tree)
