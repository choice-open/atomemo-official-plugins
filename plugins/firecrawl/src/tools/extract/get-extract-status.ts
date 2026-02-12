import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { notImplementedToolInvoke } from "../_shared-invoke"
import { t } from "../../i18n/i18n-node"
import { firecrawlCredentialParameter } from "../_shared-parameters"

export const GetExtractStatusTool: ToolDefinition = {
  name: "firecrawl-get-extract-status",
  display_name: t("TOOL_GET_EXTRACT_STATUS_DISPLAY_NAME"),
  description: t("TOOL_GET_EXTRACT_STATUS_DESCRIPTION"),
  icon: "📊",
  parameters: [
    firecrawlCredentialParameter,
    {
      type: "string",
      name: "id",
      display_name: t("LABEL_ID"),
      ui: {
        component: "input",
        hint: t("HINT_EXTRACT_ID"),
        support_expression: true,
      },
    },
  ],
  invoke: notImplementedToolInvoke,
}
