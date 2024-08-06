// import { Toolbar } from "~/components/Toolbar";
import { Toast } from "@kobalte/core/toast";
import { defaultRegistry, RegistryContext } from "rx-solid";
import { ParentComponent, ParentProps } from "solid-js";

export default function Layout(props: ParentProps) {
  return (
    <>
      <h1>Effect Playground</h1>
      <RegistryContext.Provider value={defaultRegistry}>
        <div class="h-screen flex flex-col">
          {/* <Toolbar /> */}
          {props.children}
        </div>
        <Toast.Region>
          <Toast.List />
        </Toast.Region>
      </RegistryContext.Provider>
    </>
  );
}
