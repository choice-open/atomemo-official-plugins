import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { notImplementedToolInvoke } from "../_shared-invoke"
import { firecrawlCredentialParameter } from "../_shared-parameters"

export const ListActiveCrawlsTool: ToolDefinition = {
  name: "firecrawl-list-active-crawls",
  display_name: {
    en_US: "Firecrawl List Active Crawls",
    zh_Hans_CN: "Firecrawl 列出活跃爬取",
  },
  description: {
    en_US: "List the active Firecrawl crawl jobs for the account.",
    zh_Hans_CN: "列出该账户当前活跃的 Firecrawl 爬取任务。",
  },
  icon: "📋",
  parameters: [firecrawlCredentialParameter],
  invoke: notImplementedToolInvoke,
}
