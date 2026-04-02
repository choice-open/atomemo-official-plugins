import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { microsoft365OAuth2Credential } from "./credentials/microsoft-365-oauth2"
import { demoTool } from "./tools/demo"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "🎛️",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/microsoft-365",
  locales,
  transporterOptions: {},
})

plugin.addTool(demoTool)
plugin.addCredential(microsoft365OAuth2Credential)

plugin.run()
