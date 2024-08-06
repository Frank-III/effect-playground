import { useWorkspaceHandle } from "~/workspaces/context/workspace"
import { shareRx } from "./rx"
import { createMemo } from "solid-js"

export const useShareRx = () => {
  const handle = useWorkspaceHandle()
  return createMemo(() => shareRx(handle), [handle])
}
