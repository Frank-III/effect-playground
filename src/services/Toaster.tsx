import { Array, Effect, Layer, Queue, Ref, SubscriptionRef } from "effect";
import { Toast, toaster, ToastRootProps } from "@kobalte/core/toast";
import { Component, JSX } from "solid-js";
import { X } from "lucide-solid";

export interface ToastProp extends ToastRootProps {
  title: string;
  description: JSX.Element;
  action?: JSX.Element;
}

const make = Effect.gen(function* () {
  const toasterInner = toaster;

  function createToast(
    id: number,
    toast: Omit<ToastProp, "toastId">
  ): JSX.Element {
    return (
      <Toast toastId={id} class="toast">
        <div class="toast__content">
          <div>
            <Toast.Title class="toast__title">{toast.title}</Toast.Title>
            <Toast.Description class="toast__description">
              {toast.description}
            </Toast.Description>
          </div>
          <Toast.CloseButton class="toast__close-button">
            <X />
          </Toast.CloseButton>
        </div>
        {toast.action}
      </Toast>
    );
  }

  function addToast(toast: Omit<ToastProp, "toastId">) {
    return Effect.sync(() =>
      toasterInner.show((props) => createToast(props.toastId, toast))
    );
  }

  function dismissToast(id: number) {
    Effect.sync(() => toasterInner.dismiss(id));
  }
  return {
    toast: addToast,
  };
});

export class Toaster extends Effect.Tag("app/Toaster")<
  Toaster,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.scoped(this, make);
}
