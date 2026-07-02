import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Resolve the tsconfig `@/*` alias natively. This Vite version supports (and
  // explicitly recommends) resolve.tsconfigPaths over the vite-tsconfig-paths
  // plugin, which now warns when present — so we use the native option to keep
  // test output pristine and avoid the extra dependency.
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
