import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { openaiCredential } from "./credentials/openai"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import * as openAIModels from "./models"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "symbol:icon-openai", // openai icon is builtin in Atomemo
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/openai",
  locales,
  transporterOptions: {},
})

plugin.addCredential(openaiCredential)

Object.values(openAIModels).forEach((model) => {
  plugin.addModel(model)
})

plugin.run()
