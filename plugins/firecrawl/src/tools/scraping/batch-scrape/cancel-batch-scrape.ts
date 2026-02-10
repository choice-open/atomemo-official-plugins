import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  batchIdParameter,
  firecrawlCredentialParameter,
} from "../../_shared-parameters"
import { notImplementedToolInvoke } from "../../_shared-invoke"

export const CancelBatchScrapeTool: ToolDefinition = {
  name: "firecrawl-cancel-batch-scrape",
  display_name: {
    en_US: "Firecrawl Cancel Batch Scrape",
    zh_Hans_CN: "Firecrawl 取消批量爬取",
  },
  description: {
    en_US: "Cancel a Firecrawl batch scrape job.",
    zh_Hans_CN: "取消 Firecrawl 批量爬取作业。",
  },
  icon: "🛑",
  parameters: [firecrawlCredentialParameter, batchIdParameter],
  invoke: notImplementedToolInvoke,
}
