import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { geminiApiKeyCredential } from "./credentials/gemini-api-key"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { editImageTool } from "./tools/edit-image"
import { generateImageTool } from "./tools/generate-image"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "symbol:icon-gemini",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/blob/main/plugins/nano-banana/README.md",
  locales,
  transporterOptions: {},
})

plugin.addCredential(geminiApiKeyCredential)
plugin.addTool(generateImageTool)
plugin.addTool(editImageTool)

plugin.run()
