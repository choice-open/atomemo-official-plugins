import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import {
  errorResponse,
  firecrawlRequest,
  getArgs,
  getFirecrawlApiKey,
} from "../../_shared/firecrawl-client"
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
    try {
      const apiKey = await getFirecrawlApiKey(context)
      const { parameters } = getArgs(context)
      const batchId = parameters.batchId
      if (typeof batchId !== "string" || !batchId.trim()) {
        return errorResponse(new Error("Parameter `batchId` is required."))
      }

      return firecrawlRequest({
        apiKey,
        method: "DELETE",
        path: `/batch/scrape/${encodeURIComponent(batchId)}`,
      })
    } catch (e) {
      return errorResponse(e)
    }
  },
}
