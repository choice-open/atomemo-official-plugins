import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { feishuAppCredential } from "./credentials/feishu-app-credential"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { allFeishuTools } from "./tools/feishu-tools"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "🎛️",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/feishu",
  locales,
  transporterOptions: {},
})

plugin.addCredential(feishuAppCredential)
for (const tool of allFeishuTools) {
  plugin.addTool(tool)
}

plugin.run()
