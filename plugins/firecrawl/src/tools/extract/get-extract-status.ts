import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  errorResponse,
  firecrawlRequest,
  getArgs,
  getFirecrawlApiKey,
} from "../_shared/firecrawl-client"
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
        path: `/extract/${encodeURIComponent(id)}`,
      })
    } catch (e) {
      return errorResponse(e)
    }
  },
}
