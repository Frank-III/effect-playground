import { Data, Option } from "effect";
import {
  useWorkspaceHandle,
  useWorkspaceTree,
} from "~/workspaces/context/workspace";
import { FileTree } from "./file-explorer/file-tree";
import { File, Directory } from "~/workspaces/domain/workspace";
import { Rx, useRxSet, useRxValue } from "rx-solid";

export declare namespace FileExplorer {
  export type InputType = "File" | "Directory";

  export type State = Data.TaggedEnum<{
    Idle: {};
    Creating: {
      parent: Directory;
      type: InputType;
    };
    Editing: {
      node: Directory | File;
    };
  }>;
}

export const State = Data.taggedEnum<FileExplorer.State>();
export const stateRx = Rx.make<FileExplorer.State>(State.Idle());

export const useExplorerState = () => useRxValue(stateRx);
export const useExplorerDispatch = () => useRxSet(stateRx);
export const useCreate = () => {
  const handle = useWorkspaceHandle();
  const create = useRxSet(handle.create);
  const dispatch = useExplorerDispatch();
  return (parent: Directory, name: string, type: FileExplorer.InputType) => {
    create([Option.some(parent), name, type]);
    dispatch(State.Idle());
  };
};

export const useRename = () => {
  const handle = useWorkspaceHandle();
  const rename = useRxSet(handle.rename);
  const dispatch = useExplorerDispatch();
  return (node: File | Directory, name: string) => {
    rename([node, name]);
    dispatch(State.Idle());
  };
};
export const useRemove = () => {
  const handle = useWorkspaceHandle();
  const remove = useRxSet(handle.remove);
  const dispatch = useExplorerDispatch();
  return (node: File | Directory) => {
    remove(node);
    dispatch(State.Idle());
  };
};

export function FileExplorer() {
  const tree = useWorkspaceTree();
  return (
    <aside class="min-h-full w-full overflow-auto">
      <FileTree tree={tree()} />
    </aside>
  );
}