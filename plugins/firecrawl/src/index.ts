import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { firecrawlCredential } from "./credentials"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import {
  BatchScrapeTool,
  CancelBatchScrapeTool,
  CancelCrawlTool,
  CrawlAWebsiteTool,
  ExtractStructuredDataTool,
  GetBatchScrapeErrorsTool,
  GetBatchScrapeStatusTool,
  GetCrawlErrorsTool,
  GetCrawlStatusTool,
  GetExtractStatusTool,
  ListActiveCrawlsTool,
  MapWebsiteTool,
  PreviewCrawlParamsTool,
  ScrapeAUrlAndGetItsContentTool,
  SearchContentTool,
} from "./tools"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "symbol:icon-firecrawl",// firecrawl icon is builtin in Atomemo
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/firecrawl",
  locales,
  transporterOptions: {},
})

plugin.addCredential(firecrawlCredential)

// Add all tools to the plugin
plugin.addTool(CrawlAWebsiteTool)
plugin.addTool(CancelCrawlTool)
plugin.addTool(GetCrawlErrorsTool)
plugin.addTool(GetCrawlStatusTool)
plugin.addTool(ListActiveCrawlsTool)
plugin.addTool(PreviewCrawlParamsTool)
plugin.addTool(ScrapeAUrlAndGetItsContentTool)
plugin.addTool(BatchScrapeTool)
plugin.addTool(CancelBatchScrapeTool)
plugin.addTool(GetBatchScrapeErrorsTool)
plugin.addTool(GetBatchScrapeStatusTool)
plugin.addTool(MapWebsiteTool)
plugin.addTool(SearchContentTool)
plugin.addTool(ExtractStructuredDataTool)
plugin.addTool(GetExtractStatusTool)

plugin.run()
