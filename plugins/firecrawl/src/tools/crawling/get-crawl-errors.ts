import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../i18n/i18n-node";
import {
  asToolResult,
  createFirecrawlClient,
  errorResponse,
  getArgs,
  getFirecrawlApiKey,
} from "../_shared/firecrawl-client";
import {
  crawlIdParameter,
  firecrawlCredentialParameter,
} from "../_shared-parameters";

export const GetCrawlErrorsTool: ToolDefinition = {
  name: "firecrawl-get-crawl-errors",
  display_name: t("TOOL_GET_CRAWL_ERRORS_DISPLAY_NAME"),
  description: t("TOOL_GET_CRAWL_ERRORS_DESCRIPTION"),
  icon: "⚠️",
  parameters: [firecrawlCredentialParameter, crawlIdParameter],
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
      return asToolResult(client.getCrawlErrors(id));
    } catch (e) {
      return errorResponse(e);
    }
  },
};
