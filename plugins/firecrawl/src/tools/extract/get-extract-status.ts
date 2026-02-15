import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../i18n/i18n-node";
import {
  asToolResult,
  createFirecrawlClient,
  errorResponse,
  getArgs,
  getFirecrawlApiKey,
} from "../_shared/firecrawl-client";
import { firecrawlCredentialParameter } from "../_shared-parameters";

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
  invoke: async ({ args }) => {
    try {
      const apiKey = getFirecrawlApiKey(args);
      if (!apiKey) {
        return errorResponse(
          new Error(
            "Missing Firecrawl API key in credential. Please select a valid Firecrawl credential.",
          ),
        );
      }
      const { parameters } = getArgs(args);
      const id = parameters.id;
      if (typeof id !== "string" || !id.trim()) {
        return errorResponse(new Error("Parameter `id` is required."));
      }

      const client = createFirecrawlClient(apiKey);
      return asToolResult(client.getExtractStatus(id));
    } catch (e) {
      return errorResponse(e);
    }
  },
};
