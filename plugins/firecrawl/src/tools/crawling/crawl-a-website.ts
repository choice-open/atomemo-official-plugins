import type {
  PropertyObject,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../i18n/i18n-node";
import {
  asToolResult,
  createFirecrawlClient,
  errorResponse,
  getArgs,
  getFirecrawlApiKey,
  parseCustomBody,
  sanitizeRequestBody,
} from "../_shared/firecrawl-client";
import {
  customBodyParameter,
  firecrawlCredentialParameter,
  scrapeOptionsParameter,
} from "../_shared-parameters";

const requestOptions: PropertyObject = {
  type: "object",
  name: "requestOptions",
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
      name: "prompt",
      type: "string",
      display_name: t("LABEL_CRAWL_PROMPT"),
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "input",
        hint: t("HINT_CRAWL_PROMPT"),
        support_expression: true,
      },
    },
    {
      name: "limit",
      type: "integer",
      display_name: t("LABEL_LIMIT"),
      default: 10000,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "number-input",
        hint: t("HINT_CRAWL_LIMIT"),
        support_expression: true,
      },
    },
    {
      name: "delay",
      type: "integer",
      default: 123,
      display_name: t("LABEL_DELAY"),
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "number-input",
        hint: t("HINT_CRAWL_DELAY"),
        support_expression: true,
      },
    },
    {
      name: "maxConcurrency",
      type: "integer",
      default: 8,
      display_name: t("LABEL_MAX_CONCURRENCY"),
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "number-input",
        hint: t("HINT_MAX_CONCURRENCY"),
        support_expression: true,
      },
    },
    {
      name: "excludePaths",
      type: "array",
      display_name: t("LABEL_EXCLUDE_PATHS"),
      display: {
        show: { useCustomBody: false },
      },
      items: {
        type: "string",
        name: "excludePath",
      },
      ui: {
        component: "array-section",
        hint: t("HINT_EXCLUDE_PATHS"),
      },
    },
    {
      name: "includePaths",
      type: "array",
      display_name: t("LABEL_INCLUDE_PATHS"),
      display: {
        show: { useCustomBody: false },
      },
      items: {
        type: "string",
        name: "includePath",
      },
      ui: {
        component: "array-section",
        hint: t("HINT_INCLUDE_PATHS"),
      },
    },
    {
      name: "sitemap",
      type: "string",
      display_name: t("LABEL_SITEMAP"),
      enum: ["include", "skip"],
      default: "include",
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "select",
        hint: t("HINT_SITEMAP_MODE"),
        support_expression: true,
      },
    },
    {
      name: "ignoreQueryParameters",
      type: "boolean",
      display_name: t("LABEL_IGNORE_QUERY_PARAMETERS"),
      default: false,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "switch",
        hint: t("HINT_IGNORE_QUERY_PARAMETERS"),
        support_expression: true,
      },
    },
    {
      name: "allowExternalLinks",
      type: "boolean",
      display_name: t("LABEL_ALLOW_EXTERNAL_LINKS"),
      default: false,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "switch",
        hint: t("HINT_ALLOW_EXTERNAL_LINKS"),
        support_expression: true,
      },
    },
    {
      name: "allowSubdomains",
      type: "boolean",
      display_name: t("LABEL_ALLOW_SUBDOMAINS"),
      default: false,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "switch",
        hint: t("HINT_ALLOW_SUBDOMAINS"),
        support_expression: true,
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

export const CrawlAWebsiteTool: ToolDefinition = {
  name: "firecrawl-crawl",
  display_name: t("TOOL_NAME_FIRECRAWL_CRAWL"),
  description: t("TOOL_DESCRIPTION_FIRECRAWL_CRAWL"),
  icon: "🕸️",
  parameters: [
    firecrawlCredentialParameter,
    {
      type: "string",
      name: "url",
      display_name: t("LABEL_URL"),
      required: true,
      ui: {
        component: "input",
        hint: t("HINT_URL"),
        support_expression: true,
      },
    },
    requestOptions,
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
      const requestOptions =
        (parameters.requestOptions as Record<string, unknown>) || {};

      if (typeof url !== "string" || !url.trim()) {
        return errorResponse(new Error("Parameter `url` is required."));
      }

      const body = requestOptions.useCustomBody
        ? parseCustomBody(requestOptions.customBody)
        : sanitizeRequestBody({
            url,
            ...requestOptions,
            scrapeOptions:
              (requestOptions.scrapeOptions as Record<string, unknown>) || {},
          });

      if (!("url" in body)) {
        body.url = url;
      }

      delete body.useCustomBody;
      delete body.customBody;

      const client = createFirecrawlClient(apiKey);
      return asToolResult(client.startCrawl(body.url as string, body as Parameters<typeof client.startCrawl>[1]));
    } catch (e) {
      return errorResponse(e);
    }
  },
};
