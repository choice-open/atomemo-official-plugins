import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { deepseekCredential } from "./credentials/deepseek"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import * as deepseekModels from "./models"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "symbol:icon-deepseek", // deepseek icon is builtin in Atomemo
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/deepseek",
  locales,
  transporterOptions: {},
})

plugin.addCredential(deepseekCredential)

Object.values(deepseekModels).forEach((model) => {
  plugin.addModel(model)
})

plugin.run()
