import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../../i18n/i18n-node";
import {
  asToolResult,
  createFirecrawlClient,
  errorResponse,
  getArgs,
  getFirecrawlApiKey,
} from "../../_shared/firecrawl-client";
import {
  batchIdParameter,
  firecrawlCredentialParameter,
} from "../../_shared-parameters";

export const GetBatchScrapeErrorsTool: ToolDefinition = {
  name: "firecrawl-batch-scrape-errors",
  display_name: t("TOOL_BATCH_SCRAPE_ERRORS_DISPLAY_NAME"),
  description: t("TOOL_BATCH_SCRAPE_ERRORS_DESCRIPTION"),
  icon: "⚠️",
  parameters: [firecrawlCredentialParameter, batchIdParameter],
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
      const batchId = parameters.batchId;
      if (typeof batchId !== "string" || !batchId.trim()) {
        return errorResponse(new Error("Parameter `batchId` is required."));
      }

      const client = createFirecrawlClient(apiKey);
      return asToolResult(client.getBatchScrapeErrors(batchId));
    } catch (e) {
      return errorResponse(e);
    }
  },
};
