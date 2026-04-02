import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { googleSheetsOAuth2Credential } from "./credentials"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import {
  appendRowsTool,
  batchGetValuesTool,
  clearValuesTool,
  copySheetTool,
  createSpreadsheetTool,
  getSpreadsheetInfoTool,
  readRowsTool,
  updateRowsTool,
} from "./tools"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "symbol:icon-google-sheets",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/google-sheets",
  locales,
  transporterOptions: {},
})

plugin.addCredential(googleSheetsOAuth2Credential)
plugin.addTool(readRowsTool)
plugin.addTool(updateRowsTool)
plugin.addTool(appendRowsTool)
plugin.addTool(clearValuesTool)
plugin.addTool(createSpreadsheetTool)
plugin.addTool(getSpreadsheetInfoTool)
plugin.addTool(copySheetTool)
plugin.addTool(batchGetValuesTool)

plugin.run()
