import { A } from "@solidjs/router"
import Counter from "~/components/Counter"
import Resizable from "@corvu/resizable"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger
} from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"

export default function About() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        About Page
      </h1>
      <Counter />
      <p class="mt-8">
        Visit{" "}
        <a
          href="https://solidjs.com"
          target="_blank"
          class="text-sky-600 hover:underline"
        >
          solidjs.com
        </a>{" "}
        to learn how to build Solid apps.
      </p>
      <p class="my-4">
        <A href="/" class="text-sky-600 hover:underline">
          Home
        </A>
        {" - "}
        <span>About Page</span>
      </p>
      <AlertDialog>
        <AlertDialogTrigger as={Button} variant="outline">
          Show Dialog
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Alert Dialog</AlertDialogTitle>
          <AlertDialogDescription>
            An Alert Dialog enables assistive technologies and browsers to
            distinguish alert dialogs from other dialogs so they have the
            option of giving alert dialogs special treatment, such as playing
            a system alert sound.
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
      <div class="size-full p-10 @xl:p-20">
        <Resizable class="size-full">
          <Resizable.Panel
            initialSize={0.3}
            minSize={0.2}
            class="rounded-lg bg-corvu-100"
          />
          <Resizable.Handle
            aria-label="Resize Handle"
            class="group basis-3 px-[3px]"
          >
            <div class="size-full rounded transition-colors corvu-group-active:bg-corvu-300 corvu-group-dragging:bg-corvu-100" />
          </Resizable.Handle>
          <Resizable.Panel initialSize={0.7} minSize={0.2}>
            <Resizable orientation="vertical" class="size-full">
              <Resizable.Panel
                initialSize={0.5}
                minSize={0.2}
                class="rounded-lg bg-corvu-100"
              />
              <Resizable.Handle
                aria-label="Resize Handle"
                class="group basis-3 py-[3px]"
              >
                <div class="size-full rounded transition-colors corvu-group-active:bg-corvu-300 corvu-group-dragging:bg-corvu-100" />
              </Resizable.Handle>
              <Resizable.Panel
                initialSize={0.5}
                minSize={0.2}
                class="rounded-lg bg-corvu-100"
              />
            </Resizable>
          </Resizable.Panel>
        </Resizable>
      </div>
    </main>
  )
}
