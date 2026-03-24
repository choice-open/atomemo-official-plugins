import { defineConfig } from "tsdown"

export default defineConfig({
  dts: true,
  entry: ["src/index.ts"],
  exports: {
    devExports: false,
  },
  format: "esm",
  external: [/node_modules/],
  noExternal: ["typesafe-i18n"],
  sourcemap: true,
})
