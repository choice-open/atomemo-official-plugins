import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  errorResponse,
  firecrawlRequest,
  getArgs,
  getFirecrawlApiKey,
} from "../_shared/firecrawl-client"
import {
  crawlIdParameter,
  firecrawlCredentialParameter,
} from "../_shared-parameters"

export const GetCrawlErrorsTool: ToolDefinition = {
  name: "firecrawl-get-crawl-errors",
  display_name: t("TOOL_GET_CRAWL_ERRORS_DISPLAY_NAME"),
  description: t("TOOL_GET_CRAWL_ERRORS_DESCRIPTION"),
  icon: "⚠️",
  parameters: [firecrawlCredentialParameter, crawlIdParameter],
  async invoke(context) {
    try {
      const apiKey = await getFirecrawlApiKey(context)
      const { parameters } = getArgs(context)
      const id = parameters.id
      if (typeof id !== "string" || !id.trim()) {
        return errorResponse(new Error("Parameter `id` is required."))
      }

      return firecrawlRequest({
        apiKey,
        method: "GET",
        path: `/crawl/${encodeURIComponent(id)}/errors`,
      })
    } catch (e) {
      return errorResponse(e)
    }
  },
}
