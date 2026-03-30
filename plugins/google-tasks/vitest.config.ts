import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    exclude: ["**/node_modules/**", "test/e2e/**", "test/index.test.ts"],
    environment: "node",
    globals: true,
  },
})
