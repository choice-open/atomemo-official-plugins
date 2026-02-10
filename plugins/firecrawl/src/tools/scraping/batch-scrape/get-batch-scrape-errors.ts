import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  batchIdParameter,
  firecrawlCredentialParameter,
} from "../../_shared-parameters"
import { notImplementedToolInvoke } from "../../_shared-invoke"

export const GetBatchScrapeErrorsTool: ToolDefinition = {
  name: "firecrawl-batch-scrape-errors",
  display_name: {
    en_US: "Firecrawl Get Batch Scrape Errors",
    zh_Hans_CN: "Firecrawl 获取批量爬取错误",
  },
  description: {
    en_US: "Retrieve errors from a batch scrape job.",
    zh_Hans_CN: "检索批量爬取作业中的错误。",
  },
  icon: "⚠️",
  parameters: [firecrawlCredentialParameter, batchIdParameter],
  invoke: notImplementedToolInvoke,
}
