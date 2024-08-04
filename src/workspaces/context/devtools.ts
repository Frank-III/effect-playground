import * as Solid from "solid-js"
import { useRx, useRxSet, useRxValue } from "rx-solid"
import { RxDevTools } from "../rx/devtools"

export const DevToolsContext = Solid.createContext<RxDevTools>(null as any)

export const useDevTools = () => {
  const context = Solid.useContext(DevToolsContext)
  if (!context) {
    throw new Error("WorkspaceProvider not found")
  }
  return context
}
export const useSelectedSpan = useRx(useDevTools().selectedSpan)

export const useSelectedSpanValue = useRxValue(useDevTools().selectedSpan)
export const useSetSelectedSpan = useRxSet(useDevTools().selectedSpan)

export const useSelectedSpanIndex = useRxValue(useDevTools().selectedSpanIndex)
