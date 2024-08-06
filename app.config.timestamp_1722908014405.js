// app.config.ts
import { defineConfig } from "@solidjs/start/config";
var app_config_default = defineConfig({
  vite: {
    // plugins: [tailwindcss()]
  },
  solid: {
    exclude: ["**/node_modules/.vinxi/client/deps/**/*"]
  },
  ssr: false,
  middleware: ["./middleware.ts"]
});
export {
  app_config_default as default
};
