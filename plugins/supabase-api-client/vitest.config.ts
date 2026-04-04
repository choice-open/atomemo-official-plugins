import { readFileSync } from "node:fs"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [
    {
      name: "md-import-as-text",
      load(id) {
        if (id.endsWith(".md")) {
          const code = readFileSync(id, "utf8")
          return `export default ${JSON.stringify(code)}`
        }
      },
    },
  ],
  test: {
    include: ["test/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/test/e2e/**"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.d.ts",
        "src/i18n/**",
        "src/**/i18n-node.ts",
        "**/node_modules/**",
        "**/dist/**",
      ],
      reporter: ["text", "text-summary", "html"],
    },
  },
})
