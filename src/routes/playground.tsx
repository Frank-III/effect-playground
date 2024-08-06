// import { Toolbar } from "~/components/Toolbar";
import { Toast } from "@kobalte/core/toast"
import { defaultRegistry, RegistryContext } from "rx-solid"
import { ParentProps } from "solid-js"

export default function Layout(props: ParentProps) {
  return (
    <>
      <RegistryContext.Provider value={defaultRegistry}>
        <div class="h-screen flex flex-col">
          {/* <Toolbar /> */}
          {props.children}
        </div>
        <Toast.Region limit={20}>
          <Toast.List />
        </Toast.Region>
      </RegistryContext.Provider>
    </>
  )
}
