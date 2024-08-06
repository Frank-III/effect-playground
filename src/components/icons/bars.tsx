import { Component } from "solid-js";
import type { Icon } from "~/components/icons";
import { cn } from "~/lib/utils";

export const BarsIcon: Component<Icon.CommonProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      class={cn("fill-current", props.class)}
    >
      <path d="M0 64H448V96H0V64zM0 224H448v32H0V224zM448 384v32H0V384H448z" />
    </svg>
  );
};
