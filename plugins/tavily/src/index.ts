import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { tavilyCredential } from "./credentials/tavily-credential"
import { tavilySearchTool } from "./tools/tavily-search"
import { tavilyExtractTool } from "./tools/tavily-extract"
import { tavilyCrawlTool } from "./tools/tavily-crawl"
import { tavilyMapTool } from "./tools/tavily-map"
import { tavilyResearchTool } from "./tools/tavily-research"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "🎛️",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/tavily",
  locales,
  transporterOptions: {},
})

plugin.addCredential(tavilyCredential)
plugin.addTool(tavilySearchTool)
plugin.addTool(tavilyExtractTool)
plugin.addTool(tavilyCrawlTool)
plugin.addTool(tavilyMapTool)
plugin.addTool(tavilyResearchTool)

plugin.run()
