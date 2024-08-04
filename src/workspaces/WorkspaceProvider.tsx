import { Result, useRxSuspense } from "rx-solid";
import { WorkspaceContext } from "./context/workspace";
import { Workspace } from "./domain/workspace";
import { workspaceHandleRx } from "./rx/workspace";
import { ParentComponent, Show } from "solid-js";

export const WorkspaceProvider: ParentComponent<{ workspace: Workspace }> = (
  props
) => {
  const handle = useRxSuspense(workspaceHandleRx(props.workspace));
  return (
    <Show
      when={handle() && handle()?._tag === "Success"}
      fallback={<div>loading</div>}
    >
      {(success) => (
        <WorkspaceContext.Provider value={handle()!.value}>
          {props.children}
        </WorkspaceContext.Provider>
      )}
    </Show>
  );
};
