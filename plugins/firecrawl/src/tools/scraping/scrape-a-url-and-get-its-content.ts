import type {
  PropertyDiscriminatedUnion,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  customBodyParameter,
  firecrawlCredentialParameter,
  parsersParameter,
  scrapeOptionsParameter,
} from "../_shared-parameters"
import { notImplementedToolInvoke } from "../_shared-invoke"
import { t } from "../../i18n/i18n-node"

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
  invoke: notImplementedToolInvoke,
}
