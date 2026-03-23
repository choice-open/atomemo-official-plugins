import { defineConfig } from "tsdown"

export default defineConfig({
  dts: true,
  entry: ["src/index.ts"],
  exports: {
    devExports: false,
  },
  format: "esm",
  inlineOnly: ["typesafe-i18n"],
  sourcemap: true,
  plugins: [
    {
      name: "md-text",
      transform(code, id) {
        if (id.endsWith(".md")) {
          return { code: `export default ${code}`, map: null }
        }
      },
    },
  ],
})
