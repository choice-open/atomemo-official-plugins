import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import {
  batchIdParameter,
  firecrawlCredentialParameter,
} from "../../_shared-parameters"

export const CancelBatchScrapeTool: ToolDefinition = {
  name: "firecrawl-cancel-batch-scrape",
  display_name: t("TOOL_CANCEL_BATCH_SCRAPE_DISPLAY_NAME"),
  description: t("TOOL_CANCEL_BATCH_SCRAPE_DESCRIPTION"),
  icon: "🛑",
  parameters: [firecrawlCredentialParameter, batchIdParameter],
  async invoke(context) {
    throw new Error("Not implemented")
  },
}
