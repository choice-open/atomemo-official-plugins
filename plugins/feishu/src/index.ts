import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { feishuAppCredential } from "./credentials/feishu-app-credential"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { demoTool } from "./tools/demo"
import { sendFeishuAppMessageTool } from "./tools/send-app-message"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "🎛️",
  lang: "typescript",
  version: packageJSON.version,
  repo: "",
  locales,
  transporterOptions: {},
})

plugin.addTool(demoTool)
plugin.addTool(sendFeishuAppMessageTool)
plugin.addCredential(feishuAppCredential)

plugin.run()
