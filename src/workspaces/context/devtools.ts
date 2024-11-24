import * as Solid from "solid-js"
import { createRx, createRxSet, createRxValue } from "rx-solid"
import { RxDevTools } from "../rx/devtools"

export const DevToolsContext = Solid.createContext<RxDevTools>(null as any)

export const useDevTools = () => {
  const context = Solid.useContext(DevToolsContext)
  if (!context) {
    throw new Error("WorkspaceProvider not found")
  }
  return context
}
export const useSelectedSpan = createRx(useDevTools().selectedSpan)

export const useSelectedSpanValue = createRxValue(useDevTools().selectedSpan)
export const useSetSelectedSpan = createRxSet(useDevTools().selectedSpan)

export const useSelectedSpanIndex = createRxValue(useDevTools().selectedSpanIndex)
