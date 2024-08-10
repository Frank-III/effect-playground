import { Hash } from "effect"
// import Resizable from "@corvu/resizable"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel
} from "~/components/ui/resizable"
import { useRxSet } from "rx-solid"
import { LoadingSpinner } from "~/components/ui/loading-spinner"
import { Workspace } from "~/workspaces/domain/workspace"
import {
  useWorkspaceHandle,
  useWorkspaceShells
} from "~/workspaces/context/workspace"
import { makePersisted } from "@solid-primitives/storage"
import { WorkspaceProvider } from "~/workspaces/WorkspaceProvider"
import { Icon } from "../icons"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "~/components/ui/tabs"
import { FileEditor } from "./components/common/file-editor"
import { FileExplorer } from "./components/common/file-explorer"
import { Terminal } from "./components/common/terminal"
// import { TraceViewer } from "./components/common/trace-viewer";
import {
  Component,
  ComponentProps,
  createSignal,
  For,
  Show,
  Suspense
} from "solid-js"

export declare namespace CodeEditor {
  export interface Props {
    readonly disableExplorer?: boolean
    readonly workspace: Workspace
  }
}

export const CodeEditor: Component<{
  readonly disableExplorer?: boolean
  readonly workspace: Workspace
}> = (props) => {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading editor..." />}>
      <WorkspaceProvider workspace={props.workspace}>
        <CodeEditorSuspended
          disableExplorer={props.disableExplorer || false}
        />
      </WorkspaceProvider>
    </Suspense>
  )
}

export const CodeEditorSuspended: Component<{
  readonly disableExplorer?: boolean
}> = (props) => {
  const handle = useWorkspaceHandle()
  // const [persistedSizes, setPersistedSizes] = makePersisted(
  //   createSignal<number[]>([]),
  //   {
  //     name: "resizable-sizes",
  //   }
  // );

  const setSize = useRxSet(handle.terminalSize)
  const onResize = () => setSize()

  return (
    // <Resizable orientation="vertical" sizes={persistedSizes()}>
    <Resizable orientation="vertical">
      <ResizablePanel initialSize={0.7}>
        <Show when={!props.disableExplorer} fallback={<FileEditor />} keyed>
          <Resizable orientation="horizontal">
            <ResizablePanel
              initialSize={0.3}
              // minSize={0.2}
              class="bg-gray-50 dark:bg-neutral-900 min-w-[200px] flex flex-col"
            >
              <FileExplorer />
            </ResizablePanel>
            <ResizableHandle
              aria-label="Resize Handle"
              class="group basis-3 py-[3px]"
            />
            {/* <div class="size-full bg-neutral-200 dark:bg-neutral-700" /> */}
            <ResizablePanel initialSize={0.7}>
              <div class="flex size-full items-center justify-center">
                <p>Editor</p>
              </div>
              {/* <FileEditor /> */}
            </ResizablePanel>
          </Resizable>
        </Show>
      </ResizablePanel>
      <ResizableHandle
        aria-label="Resize Handle"
        class="group basis-3 py-[3px]"
      />
      {/* <div class="size-full rounded transition-colors corvu-group-active:bg-corvu-300 corvu-group-dragging:bg-corvu-100" /> */}
      {/* <div class="size-full bg-neutral-200 dark:bg-neutral-700" /> */}
      {/* </Resizable.Handle> */}
      {/* <ResizablePanel initialSize={0.3} onResize={onResize}> */}
      <ResizablePanel initialSize={0.3}>
        {/* <Resizable
          orientation="horizontal"
          class="border-y border-neutral-300 dark:border-neutral-700 size-full"
        > */}
        <Tabs defaultValue="terminal" class="flex flex-col">
          <TabsList class="items-center justify-start">
            <TabsTrigger value="terminal">
              <Icon name="display" class="h-3 w-3 mr-2" />
              <span class="font-mono font-bold text-xs">Terminal</span>
            </TabsTrigger>
            <TabsTrigger value="trace-viewer">
              <Icon name="mixer-horizontal" class="h-3 w-3 mr-2" />
              <span class="font-mono font-bold text-xs">Trace Viewer</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="terminal"
            forceMount
            class="hidden [&[data-selected]]:flex h-full w-full overflow-y-auto "
          >
            <WorkspaceShells />
          </TabsContent>
          <TabsContent
            value="trace-viewer"
            forceMount
            class="h-full w-full overflow-y-auto hidden [&[data-selected]]:flex"
          >
            <h2>Haven't Implemented Yet</h2>
            {/* <TraceViewer /> */}
          </TabsContent>
        </Tabs>
        {/* </Resizable> */}
      </ResizablePanel>
    </Resizable>
  )
}

function WorkspaceShells() {
  const handle = useWorkspaceHandle()
  const shells = useWorkspaceShells()
  const setSize = useRxSet(handle.terminalSize)
  const onResize = function (..._: any) {
    setSize()
  }

  return (
    <For each={shells()}>
      {(shell, index) => (
        <>
          <Show when={index() > 0} keyed>
            <ResizableHandle />
          </Show>
          <ResizablePanel
            id={`${Hash.hash(shell)}`}
            onResize={onResize}
            // order={index}
            class="h-full"
          >
            <Terminal shell={shell} />
          </ResizablePanel>
        </>
      )}
    </For>
  )
}
