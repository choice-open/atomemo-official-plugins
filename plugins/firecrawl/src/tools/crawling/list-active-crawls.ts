import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  asToolResult,
  createFirecrawlClient,
  errorResponse,
  getFirecrawlApiKey,
} from "../_shared/firecrawl-client"
import { firecrawlCredentialParameter } from "../_shared-parameters"

export const ListActiveCrawlsTool: ToolDefinition = {
  name: "firecrawl-list-active-crawls",
  display_name: t("TOOL_LIST_ACTIVE_CRAWLS_DISPLAY_NAME"),
  description: t("TOOL_LIST_ACTIVE_CRAWLS_DESCRIPTION"),
  icon: "📋",
  parameters: [firecrawlCredentialParameter],
  invoke: async ({ args }) => {
    try {
      const apiKey = getFirecrawlApiKey(args)
      if (!apiKey) {
        return errorResponse(
          new Error(
            "Missing Firecrawl API key in credential. Please select a valid Firecrawl credential.",
          ),
        )
      }
      const client = createFirecrawlClient(apiKey)
      return asToolResult(client.getActiveCrawls())
    } catch (e) {
      return errorResponse(e)
    }
  },
}
