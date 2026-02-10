import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  batchIdParameter,
  firecrawlCredentialParameter,
} from "../../_shared-parameters"
import { notImplementedToolInvoke } from "../../_shared-invoke"

export const GetBatchScrapeStatusTool: ToolDefinition = {
  name: "firecrawl-batch-scrape-status",
  display_name: {
    en_US: "Firecrawl Get Batch Scrape Status",
    zh_Hans_CN: "Firecrawl 获取批量爬取状态",
  },
  description: {
    en_US: "Retrieve the status of a batch scrape job.",
    zh_Hans_CN: "检索批量爬取作业的状态。",
  },
  icon: "📊",
  parameters: [firecrawlCredentialParameter, batchIdParameter],
  invoke: notImplementedToolInvoke,
}
