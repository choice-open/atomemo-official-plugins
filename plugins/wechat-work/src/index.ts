import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { wechatWorkCredential } from "./credentials/wechat-work-credential"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { listDepartmentsTool } from "./tools/list-departments"
import { sendTextMessageTool } from "./tools/send-text-message"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "🏢",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/wechat-work",
  locales,
  transporterOptions: {},
})

plugin.addCredential(wechatWorkCredential)
plugin.addTool(listDepartmentsTool)
plugin.addTool(sendTextMessageTool)

plugin.run()
