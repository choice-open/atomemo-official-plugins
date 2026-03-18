import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    testTimeout: 10000,
    // 关键：避免不同测试文件之间共享 module cache / mocks
    // 这样 e2e 不会被单测里对 googleapis 的 mock 污染
    pool: "forks",
    isolate: true,
  },
})
