import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import {
  batchIdParameter,
  firecrawlCredentialParameter,
} from "../../_shared-parameters"
import { notImplementedToolInvoke } from "../../_shared-invoke"

export const GetBatchScrapeErrorsTool: ToolDefinition = {
  name: "firecrawl-batch-scrape-errors",
  display_name: t("TOOL_BATCH_SCRAPE_ERRORS_DISPLAY_NAME"),
  description: t("TOOL_BATCH_SCRAPE_ERRORS_DESCRIPTION"),
  icon: "⚠️",
  parameters: [firecrawlCredentialParameter, batchIdParameter],
  invoke: notImplementedToolInvoke,
}
