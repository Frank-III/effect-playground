// import { Toolbar } from "~/components/Toolbar";
import { Toast } from "@kobalte/core/toast";
import { ParentComponent } from "solid-js";

export const PlaygroundLayout: ParentComponent<{}> = (props) => {
  return (
    <>
      <div class="h-screen flex flex-col">
        {/* <Toolbar /> */}
        {props.children}
      </div>
      <Toast.Region>
        <Toast.List />
      </Toast.Region>
    </>
  );
};
