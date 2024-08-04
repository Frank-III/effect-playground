import { Directory } from "~/workspaces/domain/workspace";
import { useCreate, useExplorerState, FileExplorer } from "../file-explorer";
import { FileNode } from "./file-node";
import { FileTree } from "./file-tree";
import { FileInput } from "./file-input";
import { Accessor, createSignal, Match, Show, Switch } from "solid-js";

export function DirectoryNode({
  depth,
  node,
  path,
}: {
  readonly node: Directory;
  readonly depth: number;
  readonly path: string;
}) {
  const [open, setOpen] = createSignal(true);
  const state = useExplorerState();
  const create = useCreate();

  function isCreating() {
    return state()._tag === "Creating" && state().parent === node;
  }

  const handleToggle = () => setOpen(!open());

  return (
    <>
      <FileNode
        type="directory"
        node={node}
        depth={depth}
        path={path}
        isOpen={open()}
        onClick={handleToggle}
      />
      <Show when={open()}>
        {/* how can I make it typed */}
        <Show when={isCreating() && state.type === "Directory"}>
          <FileInput
            type={state().type}
            depth={depth + 1}
            onSubmit={(name) => create(node, name, "Directory")}
          />
        </Show>
        <FileTree tree={node.children} depth={depth + 1} path={path} />
        <Show when={isCreating() && state.type === "File"}>
          <FileInput
            type={state.type}
            depth={depth + 1}
            onSubmit={(name) => create(node, name, "File")}
          />
        </Show>
      </Show>
    </>
  );
}
