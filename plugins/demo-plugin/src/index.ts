import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { demoCredential } from "./credentials/demo"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { demoModelChat } from "./models/demo-chat"
import { demoModelReasoning } from "./models/demo-reasoning"
import { demoTool } from "./tools/demo"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "🎛️",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/demo-plugin",
  locales,
  transporterOptions: {},
})

plugin.addCredential(demoCredential)

plugin.addModel(demoModelChat)
plugin.addModel(demoModelReasoning)

plugin.addTool(demoTool)

plugin.run()
