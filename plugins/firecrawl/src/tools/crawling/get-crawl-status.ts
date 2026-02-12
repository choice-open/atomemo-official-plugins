import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { notImplementedToolInvoke } from "../_shared-invoke"
import { t } from "../../i18n/i18n-node"
import {
  crawlIdParameter,
  firecrawlCredentialParameter,
} from "../_shared-parameters"

export const GetCrawlStatusTool: ToolDefinition = {
  name: "firecrawl-get-crawl-status",
  display_name: t("TOOL_GET_CRAWL_STATUS_DISPLAY_NAME"),
  description: t("TOOL_GET_CRAWL_STATUS_DESCRIPTION"),
  icon: "📈",
  parameters: [firecrawlCredentialParameter, crawlIdParameter],
  invoke: notImplementedToolInvoke,
}
