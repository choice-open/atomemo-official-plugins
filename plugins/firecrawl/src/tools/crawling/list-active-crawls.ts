import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { notImplementedToolInvoke } from "../_shared-invoke"
import { t } from "../../i18n/i18n-node"
import { firecrawlCredentialParameter } from "../_shared-parameters"

export const ListActiveCrawlsTool: ToolDefinition = {
  name: "firecrawl-list-active-crawls",
  display_name: t("TOOL_LIST_ACTIVE_CRAWLS_DISPLAY_NAME"),
  description: t("TOOL_LIST_ACTIVE_CRAWLS_DESCRIPTION"),
  icon: "📋",
  parameters: [firecrawlCredentialParameter],
  invoke: notImplementedToolInvoke,
}
