import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { getHackerNewsArticleTool } from "./tools/get-hacker-news-article"
import { getHackerNewsUserTool } from "./tools/get-hacker-news-user"
import { searchHackerNewsTool } from "./tools/search-hacker-news"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "https://news.ycombinator.com/y18.svg",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/hacker-news",
  locales,
  transporterOptions: {},
})

plugin.addTool(searchHackerNewsTool)
plugin.addTool(getHackerNewsArticleTool)
plugin.addTool(getHackerNewsUserTool)

plugin.run()
