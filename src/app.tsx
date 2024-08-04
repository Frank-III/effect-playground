import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { RegistryContext, defaultRegistry, injectRegistry } from "rx-solid";
import Nav from "~/components/Nav";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <Nav />
          <Suspense>
            <RegistryContext.Provider value={injectRegistry()}>
              {props.children}
            </RegistryContext.Provider>
          </Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
