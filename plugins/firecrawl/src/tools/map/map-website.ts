import type {
  PropertyDiscriminatedUnion,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  customBodyParameter,
  firecrawlCredentialParameter,
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
        {
          name: "search",
          type: "string",
          display_name: t("LABEL_SEARCH"),
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
          ui: {
            component: "number-input",
            hint: t("HINT_MAP_TIMEOUT"),
            support_expression: true,
          },
        },
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
  invoke: notImplementedToolInvoke,
}
