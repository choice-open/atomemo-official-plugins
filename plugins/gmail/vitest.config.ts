import { readFileSync } from "node:fs"
import type { Plugin } from "vite"
import { defineConfig } from "vitest/config"

/** Vite 7 对 `*.md` + `with { type: "text" }` 的支持不完整；与 tsdown 的 text loader 对齐，供 Vitest 解析工具 skill 文档。 */
function markdownAsDefaultExportPlugin(): Plugin {
  return {
    name: "gmail-md-skill-text",
    enforce: "pre",
    load(id) {
      const path = id.split("?")[0]
      if (!path.endsWith(".md")) return
      const raw = readFileSync(path, "utf-8")
      return `export default ${JSON.stringify(raw)}`
    },
  }
}

export default defineConfig({
  plugins: [markdownAsDefaultExportPlugin()],
  test: {
    testTimeout: 10000,
    // 关键：避免不同测试文件之间共享 module cache / mocks
    // 这样 e2e 不会被单测里对 googleapis 的 mock 污染
    pool: "forks",
    isolate: true,
  },
})
