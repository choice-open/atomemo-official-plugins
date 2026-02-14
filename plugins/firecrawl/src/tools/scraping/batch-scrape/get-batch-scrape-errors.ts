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

export const GetBatchScrapeErrorsTool: ToolDefinition = {
  name: "firecrawl-batch-scrape-errors",
  display_name: t("TOOL_BATCH_SCRAPE_ERRORS_DISPLAY_NAME"),
  description: t("TOOL_BATCH_SCRAPE_ERRORS_DESCRIPTION"),
  icon: "⚠️",
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
        method: "GET",
        path: `/batch/scrape/${encodeURIComponent(batchId)}/errors`,
      })
    } catch (e) {
      return errorResponse(e)
    }
  },
}
