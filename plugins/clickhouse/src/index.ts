import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import {
  clickhouseExecTool,
  clickhouseInsertTool,
  clickhousePingTool,
  clickhouseQueryJsonTool,
} from "./tools/clickhouse"
import { clickhouseCredential } from "./credentials/clickhouse"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "🏠",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/clickhouse",
  locales,
  transporterOptions: {},
})

plugin.addCredential(clickhouseCredential)

plugin.addTool(clickhousePingTool)
plugin.addTool(clickhouseQueryJsonTool)
plugin.addTool(clickhouseExecTool)
plugin.addTool(clickhouseInsertTool)

plugin.run()
