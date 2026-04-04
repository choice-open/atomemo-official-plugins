import { readFileSync } from "node:fs"
import { defineConfig } from "vitest/config"

/** Rolldown/Vite does not treat `.md` + `with { type: "text" }` like tsdown; load as raw string for tests. */
export default defineConfig({
  plugins: [
    {
      name: "markdown-import-as-text",
      enforce: "pre",
      load(id) {
        if (id.endsWith(".md")) {
          const text = readFileSync(id, "utf8")
          return `export default ${JSON.stringify(text)}`
        }
      },
    },
  ],
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
})
