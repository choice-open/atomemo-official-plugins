import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { airtableCredential } from "./credentials/airtable"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import {
  createRecordTool,
  deleteRecordTool,
  getARecordTool,
  getBaseSchemaTool,
  getManyBasesTool,
  searchRecordsTool,
} from "./tools"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "symbol:icon-airtable",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/airtable",
  locales,
  transporterOptions: {},
})

plugin.addCredential(airtableCredential)

// plugin.addTool(getManyBasesTool)
// plugin.addTool(getBaseSchemaTool)

// plugin.addTool(getARecordTool)
// plugin.addTool(searchRecordsTool)
// plugin.addTool(deleteRecordTool)
plugin.addTool(createRecordTool)

plugin.run()
