import type {
  PropertyObject,
  PropertyString,
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
  parseUrlsText,
  sanitizeRequestBody,
  withSchemaObject,
} from "../_shared/firecrawl-client";
import {
  customBodyParameter,
  firecrawlCredentialParameter,
  scrapeOptionsParameter,
} from "../_shared-parameters";

const options: PropertyObject = {
  name: "options",
  type: "object",
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
      type: "string",
      name: "prompt",
      display_name: t("LABEL_EXTRACT_PROMPT"),
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "textarea",
        hint: t("HINT_EXTRACT_PROMPT"),
        support_expression: true,
      },
    },
    {
      type: "string",
      name: "schema",
      display_name: t("LABEL_EXTRACT_SCHEMA"),
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "code-editor",
        language: "json",
        hint: t("HINT_EXTRACT_SCHEMA"),
        line_numbers: true,
        support_expression: true,
      },
      default: "{}",
    },
    {
      type: "boolean",
      name: "enableWebSearch",
      display_name: t("LABEL_ENABLE_WEB_SEARCH"),
      default: false,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "switch",
        hint: t("HINT_ENABLE_WEB_SEARCH"),
        support_expression: true,
      },
    },
    {
      type: "boolean",
      name: "ignoreSitemap",
      display_name: t("LABEL_IGNORE_SITEMAP"),
      default: false,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "switch",
        hint: t("HINT_IGNORE_SITEMAP"),
        support_expression: true,
      },
    },
    {
      type: "boolean",
      name: "includeSubdomains",
      display_name: t("LABEL_INCLUDE_SUBDOMAINS"),
      default: true,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "switch",
        hint: t("HINT_INCLUDE_SUBDOMAINS"),
        support_expression: true,
      },
    },
    {
      type: "boolean",
      name: "showSources",
      display_name: t("LABEL_SHOW_SOURCES"),
      default: false,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "switch",
        hint: t("HINT_SHOW_SOURCES"),
        support_expression: true,
      },
    },
    {
      type: "boolean",
      name: "ignoreInvalidURLs",
      display_name: t("LABEL_IGNORE_INVALID_URLS"),
      default: true,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "switch",
        hint: t("HINT_IGNORE_INVALID_URLS"),
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

const urlsParameters: PropertyString<"urls"> = {
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

export const ExtractStructuredDataTool: ToolDefinition = {
  name: "firecrawl-extract",
  display_name: t("TOOL_EXTRACT_STRUCTURED_DATA_DISPLAY_NAME"),
  description: t("TOOL_EXTRACT_STRUCTURED_DATA_DESCRIPTION"),
  icon: "📦",
  parameters: [firecrawlCredentialParameter, urlsParameters, options],
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
            prompt: options.prompt,
            schema: withSchemaObject(options.schema),
            enableWebSearch: options.enableWebSearch,
            ignoreSitemap: options.ignoreSitemap,
            includeSubdomains: options.includeSubdomains,
            showSources: options.showSources,
            ignoreInvalidURLs: options.ignoreInvalidURLs,
            scrapeOptions:
              (options.scrapeOptions as Record<string, unknown>) || {},
          });

      if (!("urls" in body)) {
        body.urls = urls;
      }

      const client = createFirecrawlClient(apiKey);
      return asToolResult(client.startExtract(body as Parameters<typeof client.startExtract>[0]));
    } catch (e) {
      return errorResponse(e);
    }
  },
};
