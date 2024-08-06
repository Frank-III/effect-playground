import { Hash } from "effect";
import Resizable from "@corvu/resizable";
import { useRxSet } from "rx-solid";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Workspace } from "~/workspaces/domain/workspace";
import {
  useWorkspaceHandle,
  useWorkspaceShells,
} from "~/workspaces/context/workspace";
import { makePersisted } from "@solid-primitives/storage";
import { WorkspaceProvider } from "~/workspaces/WorkspaceProvider";
import { Icon } from "../icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FileEditor } from "./components/common/file-editor";
import { FileExplorer } from "./components/common/file-explorer";
import { Terminal } from "./components/common/terminal";
// import { TraceViewer } from "./components/common/trace-viewer";
import {
  Component,
  ComponentProps,
  createSignal,
  Show,
  Suspense,
} from "solid-js";

export declare namespace CodeEditor {
  export interface Props {
    readonly disableExplorer?: boolean;
    readonly workspace: Workspace;
  }
}

export const CodeEditor: Component<{
  readonly disableExplorer?: boolean;
  readonly workspace: Workspace;
}> = (props) => {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading editor..." />}>
      <WorkspaceProvider workspace={props.workspace}>
        <CodeEditorSuspended disableExplorer={props.disableExplorer || false} />
      </WorkspaceProvider>
    </Suspense>
  );
};

export const CodeEditorSuspended: Component<{
  readonly disableExplorer?: boolean;
}> = (props) => {
  const handle = useWorkspaceHandle();
  // const [persistedSizes, setPersistedSizes] = makePersisted(
  //   createSignal<number[]>([]),
  //   {
  //     name: "resizable-sizes",
  //   }
  // );

  const setSize = useRxSet(handle.terminalSize);
  const onResize = () => setSize();

  return (
    // <Resizable orientation="vertical" sizes={persistedSizes()}>
    <Resizable orientation="vertical">
      <Resizable.Panel initialSize={0.7}>
        <Show when={!props.disableExplorer} fallback={<FileEditor />}>
          <Resizable orientation="horizontal">
            <Resizable.Panel
              initialSize={0.3}
              minSize={0.2}
              class="bg-gray-50 dark:bg-neutral-900 min-w-[200px] flex flex-col"
            >
              <FileExplorer />
            </Resizable.Panel>
            <Resizable.Handle
              aria-label="Resize Handle"
              class="group basis-3 py-[3px]"
            >
              <div class="w-px bg-neutral-200 dark:bg-neutral-700" />
            </Resizable.Handle>
            <Resizable.Panel initialSize={0.7}>
              <FileEditor />
            </Resizable.Panel>
          </Resizable>
        </Show>
      </Resizable.Panel>
      <Resizable.Handle
        aria-label="Resize Handle"
        class="group basis-3 py-[3px]"
      >
        <div class="h-px w-full bg-neutral-200 dark:bg-neutral-700" />
      </Resizable.Handle>
      <Resizable.Panel initialSize={0.3} onResize={onResize}>
        {/* <Resizable.Panel initialSize={0.3}> */}
        {/* <Resizable
          orientation="horizontal"
          class="border-y border-neutral-300 dark:border-neutral-700"
        > */}
        <Tabs defaultValue="terminal" class="flex flex-col">
          <TabsList>
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
      </Resizable.Panel>
    </Resizable>
  );
};

function WorkspaceShells() {
  const handle = useWorkspaceHandle();
  const shells = useWorkspaceShells();
  const setSize = useRxSet(handle.terminalSize);
  const onResize = function (..._: any) {
    setSize();
  };

  return (
    <>
      {shells().map((shell, index) => (
        <>
          <Show when={index > 0}>
            <Resizable.Handle>
              <div class="w-px bg-neutral-200 dark:bg-neutral-700" />
            </Resizable.Handle>
          </Show>
          <Resizable.Panel
            id={`${Hash.hash(shell)}`}
            onResize={onResize}
            // what is this
            // order={index}
            class="h-full"
          >
            <Terminal shell={shell} />
          </Resizable.Panel>
        </>
      ))}
    </>
  );
}
