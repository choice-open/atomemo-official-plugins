import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import {
  batchIdParameter,
  firecrawlCredentialParameter,
} from "../../_shared-parameters"

export const GetBatchScrapeStatusTool: ToolDefinition = {
  name: "firecrawl-batch-scrape-status",
  display_name: t("TOOL_BATCH_SCRAPE_STATUS_DISPLAY_NAME"),
  description: t("TOOL_BATCH_SCRAPE_STATUS_DESCRIPTION"),
  icon: "📊",
  parameters: [firecrawlCredentialParameter, batchIdParameter],
  async invoke(context) {
    throw new Error("Not implemented")
  },
}
