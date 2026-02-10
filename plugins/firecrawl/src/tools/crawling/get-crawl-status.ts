import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { notImplementedToolInvoke } from "../_shared-invoke"
import {
  crawlIdParameter,
  firecrawlCredentialParameter,
} from "../_shared-parameters"

export const GetCrawlStatusTool: ToolDefinition = {
  name: "firecrawl-get-crawl-status",
  display_name: {
    en_US: "Firecrawl Get Crawl Status",
    zh_Hans_CN: "Firecrawl 获取爬取状态",
  },
  description: {
    en_US: "Get the current status of a Firecrawl job.",
    zh_Hans_CN: "获取 Firecrawl 爬取任务的当前状态。",
  },
  icon: "📈",
  parameters: [firecrawlCredentialParameter, crawlIdParameter],
  invoke: notImplementedToolInvoke,
}
