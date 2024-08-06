import { Accessor, Component, createMemo, splitProps } from "solid-js"
import { Array } from "effect"
import { FileTree as Tree } from "~/workspaces/domain/workspace"
import { DirectoryNode } from "./directory-node"
import { FileNode } from "./file-node"

export const FileTree: Component<{
  tree: Tree
  depth?: number
  path?: string
}> = (props) => {
  const partitionedTree = createMemo(() =>
    Array.partition(props.tree, (_) => _._tag === "Directory")
  )

  const path = props.path || ""
  const depth = props.depth || 0

  return (
    <div class="text-sm">
      {/* directory */}
      {partitionedTree()[1].map((node) => {
        const fullPath = `${path || ""}/${node.name}`
        return (
          <DirectoryNode
            // key={fullPath}
            node={node}
            depth={depth}
            path={fullPath}
          />
        )
      })}
      {/* file */}
      {partitionedTree()[0].map((node) => {
        const fullPath = `${path}/${node.name}`
        return (
          <FileNode
            // key={fullPath}
            type="file"
            node={node}
            depth={depth}
            path={fullPath}
          />
        )
      })}
    </div>
  )
}
