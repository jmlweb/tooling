import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import baseConfig from "@jmlweb/vitest-config";

export default defineConfig({
  plugins: [react()],
  ...baseConfig,
  test: {
    ...baseConfig.test,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    coverage: {
      ...baseConfig.test?.coverage,
      reporter: ["text", "json", "html"],
    },
  },
});
