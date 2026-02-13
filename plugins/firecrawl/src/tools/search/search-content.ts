import type {
  PropertyArray,
  PropertyDiscriminatedUnion,
  PropertyObject,
  PropertyString,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  customBodyParameter,
  firecrawlCredentialParameter,
  scrapeOptionsParameter,
} from "../_shared-parameters"

const tbsParameter: PropertyString<"tbs"> = {
  type: "string",
  name: "tbs",
  display_name: t("LABEL_TIME_BASED_SEARCH"),
  ui: {
    component: "input",
    hint: t("HINT_TIME_BASED_SEARCH"),
    support_expression: true,
  },
}

const locationParameter: PropertyString<"location"> = {
  type: "string",
  name: "location",
  display_name: t("LABEL_LOCATION"),
  ui: {
    component: "input",
    hint: t("HINT_SEARCH_LOCATION"),
    support_expression: true,
  },
}

const categoriesParameter: PropertyArray<"categories"> = {
  type: "array",
  name: "categories",
  display_name: t("LABEL_CATEGORIES"),
  items: {
    type: "discriminated_union",
    discriminator: "type",
    any_of: [
      {
        name: "github",
        type: "object",
        properties: [
          {
            name: "type",
            type: "string",
            constant: "github",
          },
        ],
      },
      {
        name: "research",
        type: "object",
        properties: [
          {
            name: "type",
            type: "string",
            constant: "research",
          },
        ],
      },
      {
        name: "pdf",
        type: "object",
        properties: [
          {
            name: "type",
            type: "string",
            constant: "pdf",
          },
        ],
      },
    ],
  } satisfies PropertyDiscriminatedUnion<"type">,
}

const sourcesParameter: PropertyArray<"sources"> = {
  type: "array",
  name: "sources",
  display_name: t("LABEL_SOURCES"),
  items: {
    type: "discriminated_union",
    discriminator: "type",
    any_of: [
      {
        name: "web",
        type: "object",
        properties: [
          {
            name: "type",
            type: "string",
            constant: "web",
          },
          tbsParameter,
          locationParameter,
        ],
      },
      {
        name: "images",
        type: "object",
        properties: [
          {
            name: "type",
            type: "string",
            constant: "images",
          },
        ],
      },
      {
        name: "news",
        type: "object",
        properties: [
          {
            name: "type",
            type: "string",
            constant: "news",
          },
        ],
      },
    ],
  } satisfies PropertyDiscriminatedUnion<"type">,
}

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
      type: "integer",
      name: "limit",
      display_name: t("LABEL_LIMIT"),
      default: 5,
      minimum: 1,
      maximum: 100,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "number-input",
        hint: t("HINT_SEARCH_LIMIT"),
        support_expression: true,
      },
    },
    {
      ...sourcesParameter,
      display: {
        show: { useCustomBody: false },
      },
    },
    {
      ...categoriesParameter,
      display: {
        show: { useCustomBody: false },
      },
    },
    {
      ...tbsParameter,
      display: {
        show: { useCustomBody: false },
      },
    },
    {
      ...locationParameter,
      display: {
        show: { useCustomBody: false },
      },
    },
    {
      type: "string",
      name: "country",
      display_name: t("LABEL_COUNTRY"),
      default: "US",
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "input",
        hint: t("HINT_SEARCH_COUNTRY"),
        support_expression: true,
      },
    },
    {
      type: "integer",
      name: "timeout",
      display_name: t("LABEL_SEARCH_TIMEOUT"),
      default: 60000,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "number-input",
        hint: t("HINT_SEARCH_TIMEOUT"),
        support_expression: true,
      },
    },
    {
      type: "boolean",
      name: "ignoreInvalidURLs",
      display_name: t("LABEL_IGNORE_INVALID_URLS"),
      default: false,
      display: {
        show: { useCustomBody: false },
      },
      ui: {
        component: "switch",
        hint: t("HINT_SEARCH_IGNORE_INVALID_URLS"),
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
}

export const SearchContentTool: ToolDefinition = {
  name: "firecrawl-search",
  display_name: t("TOOL_SEARCH_CONTENT_DISPLAY_NAME"),
  description: t("TOOL_SEARCH_CONTENT_DESCRIPTION"),
  icon: "🔎",
  parameters: [
    firecrawlCredentialParameter,
    {
      type: "string",
      name: "query",
      required: true,
      ui: {
        component: "textarea",
        hint: t("HINT_SEARCH_QUERY"),
        support_expression: true,
      },
      display_name: t("PARAM_SEARCH_QUERY_LABEL"),
    },
    options,
  ],
  async invoke(context) {
    throw new Error("Not implemented")
  },
}
