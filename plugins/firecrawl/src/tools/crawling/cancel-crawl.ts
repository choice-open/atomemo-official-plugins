import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { notImplementedToolInvoke } from "../_shared-invoke"
import {
  crawlIdParameter,
  firecrawlCredentialParameter,
} from "../_shared-parameters"

export const CancelCrawlTool: ToolDefinition = {
  name: "firecrawl-cancel-crawl",
  display_name: {
    en_US: "Firecrawl Cancel Crawl",
    zh_Hans_CN: "Firecrawl 取消爬取",
  },
  description: {
    en_US: "Cancel an active Firecrawl crawl job.",
    zh_Hans_CN: "取消正在运行的 Firecrawl 爬取任务。",
  },
  icon: "🛑",
  parameters: [firecrawlCredentialParameter, crawlIdParameter],
  invoke: notImplementedToolInvoke,
}
