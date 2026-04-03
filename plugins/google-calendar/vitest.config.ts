import { readFileSync } from "node:fs"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [
    {
      name: "skill-md-as-text",
      enforce: "pre",
      load(id) {
        if (!id.endsWith("-skill.md")) return
        const text = readFileSync(id, "utf-8")
        return `export default ${JSON.stringify(text)}`
      },
    },
  ],
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
