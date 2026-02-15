import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../i18n/i18n-node";
import {
  createFirecrawlClient,
  errorResponse,
  getArgs,
  getFirecrawlApiKey,
} from "../_shared/firecrawl-client";
import {
  crawlIdParameter,
  firecrawlCredentialParameter,
} from "../_shared-parameters";

export const CancelCrawlTool: ToolDefinition = {
  name: "firecrawl-cancel-crawl",
  display_name: t("TOOL_CANCEL_CRAWL_DISPLAY_NAME"),
  description: t("TOOL_CANCEL_CRAWL_DESCRIPTION"),
  icon: "🛑",
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
      return client.cancelCrawl(id);
    } catch (e) {
      return errorResponse(e);
    }
  },
};
