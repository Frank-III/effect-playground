import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { Suspense } from "solid-js"
import { RegistryContext, defaultRegistry, injectRegistry } from "rx-solid"
import Nav from "~/components/Nav"
import "./app.css"
import { isServer } from "solid-js/web"
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR
} from "@kobalte/core"
import { getCookie } from "vinxi/http"

function getServerCookies() {
  "use server"
  const colorMode = getCookie("kb-color-mode")
  return colorMode ? `kb-color-mode=${colorMode}` : ""
}

export default function App() {
  // const storageManager = cookieStorageManagerSSR(
  //   isServer ? getServerCookies() : document.cookie
  // )

  return (
    <Router
      root={(props) => (
        <>
          {/* <ColorModeScript storageType={storageManager.type} />
          <ColorModeProvider storageManager={storageManager}> */}
          <Nav />
          <Suspense>{props.children}</Suspense>
          {/* </ColorModeProvider> */}
        </>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
