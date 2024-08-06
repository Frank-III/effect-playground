import { Component } from "solid-js";
import type { Icon } from "~/components/icons";
import { cn } from "~/lib/utils";

export const PlusIcon: Component<Icon.CommonProps> = (props) => {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class={cn("stroke-current", props.class)}
    >
      <path d="M9 2V16" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M2 9H16" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
};
