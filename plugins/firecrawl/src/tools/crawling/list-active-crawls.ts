import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  errorResponse,
  firecrawlRequest,
  getFirecrawlApiKey,
} from "../_shared/firecrawl-client"
import { firecrawlCredentialParameter } from "../_shared-parameters"

export const ListActiveCrawlsTool: ToolDefinition = {
  name: "firecrawl-list-active-crawls",
  display_name: t("TOOL_LIST_ACTIVE_CRAWLS_DISPLAY_NAME"),
  description: t("TOOL_LIST_ACTIVE_CRAWLS_DESCRIPTION"),
  icon: "📋",
  parameters: [firecrawlCredentialParameter],
  async invoke(context) {
    try {
      const apiKey = await getFirecrawlApiKey(context)
      return firecrawlRequest({
        apiKey,
        method: "GET",
        path: "/crawl/active",
      })
    } catch (e) {
      return errorResponse(e)
    }
  },
}
