import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { notImplementedToolInvoke } from "../_shared-invoke"
import {
  crawlIdParameter,
  firecrawlCredentialParameter,
} from "../_shared-parameters"

export const GetCrawlErrorsTool: ToolDefinition = {
  name: "firecrawl-get-crawl-errors",
  display_name: {
    en_US: "Firecrawl Get Crawl Errors",
    zh_Hans_CN: "Firecrawl 获取爬取错误",
  },
  description: {
    en_US: "Retrieve errors reported by a Firecrawl crawl job.",
    zh_Hans_CN: "检索 Firecrawl 爬取任务报告的错误。",
  },
  icon: "⚠️",
  parameters: [firecrawlCredentialParameter, crawlIdParameter],
  invoke: notImplementedToolInvoke,
}
