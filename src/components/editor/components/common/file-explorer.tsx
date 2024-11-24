import { Data, Option } from "effect"
import {
  useWorkspaceHandle,
  useWorkspaceTree
} from "~/workspaces/context/workspace"
import { FileTree } from "./file-explorer/file-tree"
import { File, Directory } from "~/workspaces/domain/workspace"
import { Rx, createRxSet, createRxValue } from "rx-solid"
import { batch } from "solid-js"

export declare namespace FileExplorer {
  export type InputType = "File" | "Directory"

  export type State = Data.TaggedEnum<{
    Idle: {}
    Creating: {
      parent: Directory
      type: InputType
    }
    Editing: {
      node: Directory | File
    }
  }>
}

export const State = Data.taggedEnum<FileExplorer.State>()
export const stateRx = Rx.make<FileExplorer.State>(State.Idle())

export const useExplorerState = () => createRxValue(stateRx)
export const useExplorerDispatch = () => createRxSet(stateRx)
export const useCreate = () => {
  const handle = useWorkspaceHandle()
  const create = createRxSet(handle.create)
  const dispatch = useExplorerDispatch()
  return (parent: Directory, name: string, type: FileExplorer.InputType) => {
    batch(() => {
      create([Option.some(parent), name, type])
      dispatch(State.Idle())
    })
  }
}

export const useRename = () => {
  const handle = useWorkspaceHandle()
  const rename = createRxSet(handle.rename)
  const dispatch = useExplorerDispatch()
  return (node: File | Directory, name: string) => {
    batch(() => {
      rename([node, name])
      dispatch(State.Idle())
    })
  }
}
export const useRemove = () => {
  const handle = useWorkspaceHandle()
  const remove = createRxSet(handle.remove)
  const dispatch = useExplorerDispatch()
  return (node: File | Directory) => {
    batch(() => {
      remove(node)
      dispatch(State.Idle())
    })
  }
}

export function FileExplorer() {
  const tree = useWorkspaceTree()
  return (
    <aside class="min-h-full w-full overflow-auto">
      <FileTree tree={tree()} />
    </aside>
  )
}
