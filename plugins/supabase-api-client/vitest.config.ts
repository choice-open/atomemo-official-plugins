import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
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
