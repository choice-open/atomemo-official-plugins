import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
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
    throw new Error("Not implemented")
  },
}
