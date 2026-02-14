import type {
  PropertyObject,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  errorResponse,
  firecrawlRequest,
  getArgs,
  getFirecrawlApiKey,
  parseCustomBody,
  sanitizeRequestBody,
} from "../_shared/firecrawl-client"
import {
  customBodyParameter,
  firecrawlCredentialParameter,
  parsersParameter,
  scrapeOptionsParameter,
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
}

export const ScrapeAUrlAndGetItsContentTool: ToolDefinition = {
  name: "firecrawl-scrape",
  display_name: t("TOOL_SCRAPE_URL_DISPLAY_NAME"),
  description: t("TOOL_SCRAPE_URL_DESCRIPTION"),
  icon: "🧹",
  parameters: [
    firecrawlCredentialParameter,
    {
      type: "string",
      name: "url",
      display_name: t("PARAM_SCRAPE_URL_LABEL"),
      required: true,
      ui: {
        component: "input",
        hint: t("HINT_SCRAPE_URL"),
        support_expression: true,
      },
    },
    options,
  ],
  async invoke(context) {
    try {
      const apiKey = await getFirecrawlApiKey(context)
      const { parameters } = getArgs(context)
      const url = parameters.url
      const options = (parameters.options as Record<string, unknown>) || {}

      if (typeof url !== "string" || !url.trim()) {
        return errorResponse(new Error("Parameter `url` is required."))
      }

      const body = options.useCustomBody
        ? parseCustomBody(options.customBody)
        : sanitizeRequestBody({
            url,
            parsers: options.parsers,
            ...((options.scrapeOptions as Record<string, unknown>) || {}),
          })

      if (!("url" in body)) {
        body.url = url
      }

      return firecrawlRequest({
        apiKey,
        method: "POST",
        path: "/scrape",
        body,
      })
    } catch (e) {
      return errorResponse(e)
    }
  },
}
