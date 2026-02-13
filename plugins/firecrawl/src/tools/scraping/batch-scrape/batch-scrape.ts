import type {
  PropertyObject,
  PropertyString,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import {
  customBodyParameter,
  firecrawlCredentialParameter,
  parsersParameter,
  scrapeOptionsParameter,
} from "../../_shared-parameters"

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
}

export const BatchScrapeTool: ToolDefinition = {
  name: "firecrawl-batch-scrape",
  display_name: t("TOOL_BATCH_SCRAPE_DISPLAY_NAME"),
  description: t("TOOL_BATCH_SCRAPE_DESCRIPTION"),
  icon: "📡",
  parameters: [firecrawlCredentialParameter, urlsParameter, options],
  async invoke(context) {
    throw new Error("Not implemented")
  },
}
