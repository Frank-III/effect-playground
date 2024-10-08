import { Icon } from "~/components/icons"
import { Input } from "~/components/ui/input"
import { useClickOutside } from "~/hooks/useClickOutside"
import { FileExplorer, State, useExplorerDispatch } from "../file-explorer"
import {
  batch,
  Component,
  createEffect,
  createSignal,
  JSX,
  on,
  onMount
} from "solid-js"

type X = Component
export const FileInput: Component<{
  readonly depth: number
  readonly type: FileExplorer.InputType
  readonly initialValue?: string
  readonly onSubmit: (path: string) => void
}> = (props) => {
  const initialValue = props.initialValue ?? ""
  const dispatch = useExplorerDispatch()
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>()
  const [fileName, setFileName] = createSignal(initialValue)

  const paddingLeft = 16 + props.depth * 8
  const styles = { "padding-left": `${paddingLeft}px` }

  const handleChange: JSX.ChangeEventHandler<HTMLInputElement, Event> = (
    event
  ) => setFileName(event.target.value)

  const handleSubmit: JSX.EventHandler<HTMLFormElement, Event> = (event) => {
    batch(() => {
      event.preventDefault()
      props.onSubmit(fileName())
      setFileName("")
    })
  }

  onMount(() => {
    setTimeout(() => {
      inputRef()?.focus()
    }, 0)
  })

  // Close the input when the user clicks outside
  useClickOutside(inputRef, () => dispatch(State.Idle()))

  // Close the input when the user hits the escape key
  createEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(State.Idle())
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  })

  return (
    <div style={styles} class="flex items-center py-1">
      <span class="flex items-center h-4 w-4 mr-1">
        {/* TODO: make this better use Dynamic Component */}
        <Icon
          name={props.type === "File" ? "file" : "directory-closed"}
          class={props.type === "Directory" ? "[&_path]:fill-none" : ""}
          // classList={{
          //   : ,
          // }}
        />
      </span>
      <form class="grow mr-1" onSubmit={handleSubmit}>
        <Input
          ref={(el) => setInputRef(el)}
          class="h-6 p-0 rounded-none"
          value={fileName()}
          onChange={handleChange}
          autofocus
        />
      </form>
    </div>
  )
}
