import {
  File,
  makeDirectory,
  Workspace,
  WorkspaceShell
} from "~/workspaces/domain/workspace"
import { Rx } from "rx-solid"
import { Clipboard } from "@effect/platform-browser"
import { Effect, Layer } from "effect"
import { editorRx } from "~/components/editor/rx"
// import { hashRx } from "~/rx/location"
import { pipe, Option } from "effect"
import { RxWorkspaceHandle } from "~/workspaces/rx/workspace"
import { WorkspaceCompression } from "~/lib/playground/services/WorkspaceCompression"
import packageJson from "../../../snapshots/package.json"
// TODO: do it later
// import { rpcClient } from "@/rpc/client"
// import { RetrieveRequest, ShortenRequest } from "~/services/Shorten/domain"

const runtime = Rx.runtime(
  Layer.mergeAll(WorkspaceCompression.Live, Clipboard.layer)
)

export const shareRx = Rx.family((handle: RxWorkspaceHandle) =>
  runtime.fn((_: void, get) =>
    Effect.gen(function* () {
      // const compression = yield* WorkspaceCompression
      // const workspace = get.once(handle.workspace)
      // const editor = yield* Result.toExit(
      //   get.once(editorRx(handle).editor)
      // ).pipe(Effect.orDie)

      // yield* editor.save

      // const compressed = yield* compression.compress(
      //   workspace,
      //   handle.handle.read
      // )
      // const hash = yield* rpcClient(new ShortenRequest({ text: compressed }))
      const hash = "not yet implemented"
      const url = new URL(location.href)
      url.hash = hash
      return url.toString()
    }).pipe(Effect.tapErrorCause(Effect.logError))
  )
)

export const devToolsLayer = new File({
  name: "DevTools.ts",
  initialContent: `import { DevTools } from "@effect/experimental"
import { NodeSocket } from "@effect/platform-node"
import { Effect, Layer, Logger } from "effect"

export const DevToolsLive = Layer.effectDiscard(Effect.sleep(100)).pipe(
  Layer.provideMerge(DevTools.layerSocket),
  Layer.provide(NodeSocket.layerNet({ port: 34437 })),
  Layer.merge(Logger.pretty)
)`
})

const defaultWorkspace = new Workspace({
  name: "playground",
  dependencies: packageJson.dependencies,
  shells: [new WorkspaceShell({ command: "../run src/main.ts" })],
  initialFilePath: "src/main.ts",
  tree: [
    // TODO: Revert this back to the old program
    makeDirectory("src", [
      new File({
        name: "main.ts",
        initialContent: `import { NodeRuntime } from "@effect/platform-node"
import { Effect } from "effect"
import { DevToolsLive } from "./DevTools"

const program = Effect.gen(function*() {
  yield* Effect.log("Welcome to the Effect Playground!")
}).pipe(Effect.withSpan("program", {
  attributes: { source: "Playground" }
}))

program.pipe(
  Effect.provide(DevToolsLive),
  NodeRuntime.runMain
)
`
      }),
      devToolsLayer
    ])
  ]
})

const makeDefaultWorkspace = () =>
  defaultWorkspace.withName(`playground-${Date.now()}`)

const hashRx = Rx.make(Option.none<string>())

export const importRx = runtime.rx((get) =>
  Effect.gen(function* () {
    const hash = get(hashRx)
    if (hash._tag === "None") {
      console.log("No hash")
      return makeDefaultWorkspace()
    }
    // const compressed = yield* rpcClient(
    //   new RetrieveRequest({ hash: hash.value })
    // )
    const compressed = Option.none<string>()
    if (compressed._tag === "None") return makeDefaultWorkspace()
    const compression = yield* WorkspaceCompression
    return yield* pipe(
      compression.decompress(compressed.value),
      Effect.orElseSucceed(makeDefaultWorkspace)
    )
  })
)
