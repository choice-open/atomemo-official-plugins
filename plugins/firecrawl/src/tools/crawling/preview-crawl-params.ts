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

export const PreviewCrawlParamsTool: ToolDefinition = {
  name: "firecrawl-preview-crawl-params",
  display_name: t("TOOL_PREVIEW_CRAWL_PARAMS_DISPLAY_NAME"),
  description: t("TOOL_PREVIEW_CRAWL_PARAMS_DESCRIPTION"),
  icon: "🔍",
  parameters: [
    firecrawlCredentialParameter,
    {
      type: "string",
      name: "url",
      display_name: t("PARAM_PREVIEW_URL_LABEL"),
      required: true,
      ui: {
        component: "input",
        hint: t("HINT_PREVIEW_URL"),
        support_expression: true,
      },
    },
    {
      type: "string",
      name: "prompt",
      display_name: t("PARAM_PREVIEW_PROMPT_LABEL"),
      required: true,
      max_length: 10000,
      ui: {
        component: "textarea",
        hint: t("HINT_PREVIEW_PROMPT"),
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
      const url = parameters.url;
      const prompt = parameters.prompt;

      if (typeof url !== "string" || !url.trim()) {
        return errorResponse(new Error("Parameter `url` is required."));
      }
      if (typeof prompt !== "string" || !prompt.trim()) {
        return errorResponse(new Error("Parameter `prompt` is required."));
      }

      const client = createFirecrawlClient(apiKey);
      return asToolResult(client.crawlParamsPreview(url, prompt));
    } catch (e) {
      return errorResponse(e);
    }
  },
};
