import { defineConfig } from "tsdown"

export default defineConfig({
  dts: true,
  entry: ["src/index.ts"],
  exports: {
    devExports: "development",
  },
  format: "esm",
  inlineOnly: ["typesafe-i18n"],
  loader: {
    ".md": "text",
  },
  sourcemap: true,
})
