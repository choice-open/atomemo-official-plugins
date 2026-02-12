import type {
  PropertyDiscriminatedUnion,
  PropertyString,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  customBodyParameter,
  firecrawlCredentialParameter,
  parsersParameter,
  scrapeOptionsParameter,
} from "../../_shared-parameters"
import { notImplementedToolInvoke } from "../../_shared-invoke"
import { t } from "../../../i18n/i18n-node"

const options: PropertyDiscriminatedUnion<"options", "useCustomBody"> = {
  name: "options",
  type: "discriminated_union",
  discriminator: "useCustomBody",
  discriminator_ui: {
    component: "switch",
  },
  any_of: [
    {
      name: "predefinedBody",
      type: "object",
      properties: [
        {
          name: "useCustomBody",
          type: "boolean",
          display_name: t("LABEL_USE_CUSTOM_BODY"),
          constant: false,
        },
        parsersParameter,
        scrapeOptionsParameter,
      ],
    },
    {
      name: "customBody",
      type: "object",
      properties: [
        {
          name: "useCustomBody",
          type: "boolean",
          constant: true,
        },
        customBodyParameter,
      ],
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
  invoke: notImplementedToolInvoke,
}
