import { batch, Component, createSignal, Show, splitProps } from "solid-js"
import { Equal } from "effect"
import { useRx } from "rx-solid"
import { Icon } from "~/components/icons"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger
} from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "~/components/ui/tooltip"
import { useWorkspaceHandle } from "~/workspaces/context/workspace"
import { Directory, File } from "~/workspaces/domain/workspace"
import {
  State,
  useExplorerDispatch,
  useExplorerState,
  useRemove,
  useRename
} from "../file-explorer"
import { FileInput } from "./file-input"
import { Accessor, createMemo, JSX, ParentComponent } from "solid-js"
import { AlertCircle } from "lucide-solid"

export declare namespace FileNode {
  export type Props = FileProps | DirectoryProps

  export interface FileProps extends CommonProps {
    readonly type: "file"
    readonly node: File
  }

  export interface DirectoryProps extends CommonProps {
    readonly type: "directory"
    readonly node: Directory
    readonly isOpen: boolean
  }

  export interface CommonProps {
    readonly depth: number
    readonly path: string
    readonly class?: string
    readonly onClick?: OnClick
  }

  export interface OnClick {
    (event: MouseEvent, node: File | Directory): void
  }
}

export const FileNode: Component<FileNode.Props> = (props) => {
  const [local, others] = splitProps(props, [
    "node",
    "depth",
    "path",
    "class",
    "onClick"
  ])
  const handle = useWorkspaceHandle()
  const state = useExplorerState()
  const [selectedFile, setSelectedFile] = useRx(handle.selectedFile)
  const [showControls, setShowControls] = createSignal(false)
  const rename = useRename()
  const isEditing = createMemo(() => {
    const stateRes = state()
    return (
      stateRes._tag === "Editing" && Equal.equals(stateRes.node, local.node)
    )
  })
  const isSelected = () => Equal.equals(selectedFile(), local.node)

  const handleClick: FileNode.OnClick = (event, node) => {
    batch(() => {
      if (node._tag === "File") {
        setSelectedFile(node)
      }
      props.onClick?.(event, node)
    })
  }

  return (
    <Show
      when={isEditing()}
      fallback={
        <FileNodeRoot
          isSelected={isSelected}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <FileNodeTrigger
            depth={local.depth}
            isSelected={isSelected}
            onClick={(event) => handleClick(event, local.node)}
          >
            <FileNodeIcon {...others} />
            <FileNodeName node={props.node} />
          </FileNodeTrigger>
          <Show when={showControls()}>
            <FileNodeControls node={local.node} />
          </Show>
        </FileNodeRoot>
      }
    >
      <FileInput
        type={props.node._tag}
        depth={props.depth}
        initialValue={props.node.name}
        onSubmit={(name) => rename(props.node, name)}
      />
    </Show>
  )
}

const FileNodeRoot: ParentComponent<{
  readonly isSelected: Accessor<boolean>
  readonly onMouseEnter: () => void
  readonly onMouseLeave: () => void
}> = (props) => {
  return (
    <div
      class="flex items-center transition-colors"
      classList={{
        "bg-gray-200 dark:bg-zinc-800": props.isSelected(),
        "hover:bg-gray-200/50 dark:hover:bg-zinc-800/50": !props.isSelected()
      }}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {props.children}
    </div>
  )
}

const FileNodeTrigger: ParentComponent<{
  readonly depth: number
  readonly isSelected: Accessor<boolean>
  readonly onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent>
}> = (props) => {
  // Tailwind cannot dynamically generate styles, so we resort to the `style` prop here
  const paddingLeft = 16 + props.depth * 8
  const styles = { "padding-left": `${paddingLeft}px` }

  return (
    <button
      type="button"
      style={styles}
      class="flex grow items-center py-1 [&_svg]:mr-1 [&_span]:truncate"
      classList={{
        "text-blue-500 dark:text-sky-500": props.isSelected(),
        "hover:text-blue-500 dark:hover:text-sky-500": !props.isSelected()
      }}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}

function FileNodeIcon(
  props:
    | { readonly type: "file" }
    | { readonly type: "directory"; readonly isOpen: boolean }
) {
  return props.type === "file" ? (
    <Icon name="file" />
  ) : props.isOpen ? (
    <Icon name="directory-open" />
  ) : (
    <Icon name="directory-closed" />
  )
}

const FileNodeName: Component<{
  readonly node: File | Directory
}> = (props) => {
  const fileName = props.node.name.split("/").filter(Boolean).pop()
  return <span>{fileName}</span>
}

const FileNodeControls: Component<{
  readonly node: File | Directory
}> = (props) => {
  // should I make it an Accessor here?
  const state = useExplorerState()
  const dispatch = useExplorerDispatch()
  const remove = useRemove()

  const isIdle = () => state()._tag === "Idle"

  return (
    <div class="flex items-center gap-2 mr-2">
      {props.node.userManaged && (
        <Tooltip triggerOnFocusOnly={!isIdle}>
          {" "}
          <TooltipTrigger>
            <Button
              variant="ghost"
              class="h-full p-0 rounded-none"
              onClick={() => dispatch(State.Editing({ node: props.node }))}
            >
              <span class="sr-only">Edit</span>
              <Icon name="edit" class="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>
      )}
      <Show when={props.node._tag === "Directory" && props.node}>
        {(node) => (
          <>
            <Tooltip triggerOnFocusOnly={!isIdle}>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  class="h-full p-0 rounded-none"
                  onClick={() =>
                    dispatch(
                      State.Creating({
                        parent: node(),
                        type: "File"
                      })
                    )
                  }
                >
                  <span class="sr-only">Add File</span>
                  <Icon name="file-plus" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New File...</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip triggerOnFocusOnly={!isIdle} placement="bottom">
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  class="h-full p-0 rounded-none"
                  onClick={() =>
                    dispatch(
                      State.Creating({
                        parent: node(),
                        type: "Directory"
                      })
                    )
                  }
                >
                  <span class="sr-only">Add Directory</span>
                  <Icon name="directory-plus" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New Folder...</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </Show>
      <Show when={props.node.userManaged && props.node}>
        {(node) => (
          <AlertDialog>
            <Tooltip triggerOnFocusOnly={!isIdle} placement="bottom">
              <TooltipTrigger>
                <AlertDialogTrigger
                  as={Button}
                  variant="ghost"
                  class="h-full p-0 rounded-none"
                >
                  <span class="sr-only">Delete</span>
                  <Icon name="trash" class="h-4 w-4" />
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the{" "}
                {node()._tag.toLowerCase()}.
              </AlertDialogDescription>
              <Button
                class="border-destructive bg-destructive hover:bg-destructive/80 text-destructive-foreground"
                onClick={() => remove(node())}
              >
                Confirm
              </Button>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </Show>
    </div>
  )
}
