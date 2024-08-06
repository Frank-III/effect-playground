import { defineConfig } from "@solidjs/start/config";


export default defineConfig({
  vite: {
    // plugins: [tailwindcss()]
  },
  solid: {
    exclude: ["**/node_modules/.vinxi/client/deps/**/*", "**/node_modules/.vinxi/server/deps/**/*"],
  },
  middleware: "./src/middleware.ts",
  ssr: false,
});
