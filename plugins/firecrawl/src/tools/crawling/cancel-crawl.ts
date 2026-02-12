import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { notImplementedToolInvoke } from "../_shared-invoke"
import { t } from "../../i18n/i18n-node"
import {
  crawlIdParameter,
  firecrawlCredentialParameter,
} from "../_shared-parameters"

export const CancelCrawlTool: ToolDefinition = {
  name: "firecrawl-cancel-crawl",
  display_name: t("TOOL_CANCEL_CRAWL_DISPLAY_NAME"),
  description: t("TOOL_CANCEL_CRAWL_DESCRIPTION"),
  icon: "🛑",
  parameters: [firecrawlCredentialParameter, crawlIdParameter],
  invoke: notImplementedToolInvoke,
}
