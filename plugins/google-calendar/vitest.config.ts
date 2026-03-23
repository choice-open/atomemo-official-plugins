import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    exclude: ["**/node_modules/**"],
    environment: "node",
    globals: true,
    // 端到端测试单独运行: bun run test:e2e
    env: {
      GOOGLE_CALENDAR_E2E: process.env.GOOGLE_CALENDAR_E2E ?? "0",
    },
  },
})
