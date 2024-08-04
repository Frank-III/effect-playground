import { Component } from "solid-js";

export declare namespace LoadingSpinner {
  export interface Props {
    readonly message?: string;
  }
}

export const LoadingSpinner: Component<LoadingSpinner.Props> = (props) => {
  return (
    <div class="h-full flex flex-col items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-gray-400" />
      <p class="mt-4 text-gray-500 dark:text-gray-400">{props.message}</p>
    </div>
  );
};
