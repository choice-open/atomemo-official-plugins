import type {
  PropertyObject,
  PropertyString,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../../i18n/i18n-node";
import {
  asToolResult,
  createFirecrawlClient,
  errorResponse,
  getArgs,
  getFirecrawlApiKey,
  parseCustomBody,
  parseUrlsText,
  sanitizeRequestBody,
} from "../../_shared/firecrawl-client";
import {
  customBodyParameter,
  firecrawlCredentialParameter,
  parsersParameter,
  scrapeOptionsParameter,
} from "../../_shared-parameters";

const options: PropertyObject = {
  type: "object",
  name: "options",
  properties: [
    {
      name: "useCustomBody",
      type: "boolean",
      display_name: t("LABEL_USE_CUSTOM_BODY"),
      default: false,
      ui: {
        component: "switch",
      },
    },
    {
      ...parsersParameter,
      display: {
        show: { useCustomBody: false },
      },
    },
    {
      ...scrapeOptionsParameter,
      display: {
        show: { useCustomBody: false },
      },
    },
    {
      ...customBodyParameter,
      display: {
        show: { useCustomBody: true },
      },
    },
  ],
};

// split urls into an array of strings in invoke method
const urlsParameter: PropertyString<"urls"> = {
  type: "string",
  name: "urls",
  display_name: t("LABEL_URLS"),
  required: true,
  ui: {
    component: "textarea",
    support_expression: true,
    placeholder: {
      en_US: "http://example.com/page1\nhttp://example.com/page2",
    },
  },
};

export const BatchScrapeTool: ToolDefinition = {
  name: "firecrawl-batch-scrape",
  display_name: t("TOOL_BATCH_SCRAPE_DISPLAY_NAME"),
  description: t("TOOL_BATCH_SCRAPE_DESCRIPTION"),
  icon: "📡",
  parameters: [firecrawlCredentialParameter, urlsParameter, options],
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
      const options = (parameters.options as Record<string, unknown>) || {};
      const urls = parseUrlsText(parameters.urls);

      if (!options.useCustomBody && urls.length === 0) {
        return errorResponse(
          new Error("Parameter `urls` must contain at least one URL."),
        );
      }

      const body = options.useCustomBody
        ? parseCustomBody(options.customBody)
        : sanitizeRequestBody({
            urls,
            parsers: options.parsers,
            ...((options.scrapeOptions as Record<string, unknown>) || {}),
          });

      if (!("urls" in body)) {
        body.urls = urls;
      }

      const client = createFirecrawlClient(apiKey);
      const urlsList = (body.urls as string[]) || urls;
      const { urls: _u, ...rest } = body as Record<string, unknown>;
      const batchOpts =
        Object.keys(rest).length > 0 ? { options: rest } : undefined;
      return asToolResult(client.startBatchScrape(urlsList, batchOpts));
    } catch (e) {
      return errorResponse(e);
    }
  },
};
