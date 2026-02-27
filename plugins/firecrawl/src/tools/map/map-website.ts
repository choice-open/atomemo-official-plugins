import type {
  PropertyObject,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  asToolResult,
  createFirecrawlClient,
  errorResponse,
  getArgs,
  getFirecrawlApiKey,
  parseCustomBody,
  sanitizeRequestBody,
} from "../_shared/firecrawl-client"
import {
  customBodyParameter,
  firecrawlCredentialParameter,
} from "../_shared-parameters"

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
      name: "search",
      type: "string",
      display_name: t("LABEL_SEARCH"),
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "input",
        hint: t("HINT_MAP_SEARCH"),
        support_expression: true,
      },
    },
    {
      name: "sitemap",
      type: "string",
      display_name: t("LABEL_SITEMAP"),
      enum: ["skip", "include", "only"],
      default: "include",
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "select",
        hint: t("HINT_MAP_SITEMAP"),
        support_expression: true,
      },
    },
    {
      name: "includeSubdomains",
      type: "boolean",
      display_name: t("LABEL_INCLUDE_SUBDOMAINS"),
      default: true,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "switch",
        hint: t("HINT_MAP_INCLUDE_SUBDOMAINS"),
        support_expression: true,
      },
    },
    {
      name: "ignoreQueryParameters",
      type: "boolean",
      display_name: t("LABEL_IGNORE_QUERY_PARAMETERS"),
      default: true,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "switch",
        hint: t("HINT_MAP_IGNORE_QUERY_PARAMETERS"),
        support_expression: true,
      },
    },
    {
      name: "limit",
      type: "integer",
      display_name: t("LABEL_LIMIT"),
      default: 5000,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "number-input",
        hint: t("HINT_MAP_LIMIT"),
        support_expression: true,
      },
    },
    {
      name: "timeout",
      type: "integer",
      display_name: t("LABEL_MAP_TIMEOUT"),
      default: 10000,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "number-input",
        hint: t("HINT_MAP_TIMEOUT"),
        support_expression: true,
      },
    },
    {
      ...customBodyParameter,
      display: {
        show: { useCustomBody: true },
      },
    },
  ],
}

export const MapWebsiteTool: ToolDefinition = {
  name: "firecrawl-map",
  display_name: t("TOOL_MAP_WEBSITE_DISPLAY_NAME"),
  description: t("TOOL_MAP_WEBSITE_DESCRIPTION"),
  icon: "🗺️",
  parameters: [
    firecrawlCredentialParameter,
    {
      type: "string",
      name: "url",
      required: true,
      ui: {
        component: "input",
        hint: t("HINT_MAP_URL"),
        support_expression: true,
      },
      display_name: t("PARAM_MAP_URL_LABEL"),
    },
    options,
  ],
  invoke: async ({ args }) => {
    try {
      const apiKey = getFirecrawlApiKey(args)
      if (!apiKey) {
        return errorResponse(
          new Error(
            "Missing Firecrawl API key in credential. Please select a valid Firecrawl credential.",
          ),
        )
      }
      const { parameters } = getArgs(args)
      const url = parameters.url
      const options = (parameters.options as Record<string, unknown>) || {}

      if (typeof url !== "string" || !url.trim()) {
        return errorResponse(new Error("Parameter `url` is required."))
      }

      const body = options.useCustomBody
        ? parseCustomBody(options.customBody)
        : sanitizeRequestBody({
            url,
            ...options,
          })

      if (!("url" in body)) {
        body.url = url
      }

      delete body.useCustomBody
      delete body.customBody

      const urlStr = (body.url as string) || url
      const { url: _u, ...mapOpts } = body as Record<string, unknown>

      const client = createFirecrawlClient(apiKey)
      return asToolResult(
        client.map(urlStr, mapOpts as Parameters<typeof client.map>[1]),
      )
    } catch (e) {
      return errorResponse(e)
    }
  },
}
