import { createMiddleware } from "@solidjs/start/middleware";
import { appendHeader } from "vinxi/http";

export default createMiddleware({
  onRequest: [
    event => {
      const e = event.nativeEvent;
      appendHeader(e, 'Cross-Origin-Opener-Policy', 'same-origin');
      appendHeader(e,'Cross-Origin-Embedder-Policy', 'require-corp');
      appendHeader(e,'Cross-Origin-Resource-Policy', 'cross-origin');
    }
  ]
});