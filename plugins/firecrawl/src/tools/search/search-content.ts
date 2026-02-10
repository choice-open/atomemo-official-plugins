import type {
  PropertyArray,
  PropertyDiscriminatedUnion,
  PropertyString,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  customBodyParameter,
  firecrawlCredentialParameter,
  scrapeOptionsParameter,
} from "../_shared-parameters"
import { notImplementedToolInvoke } from "../_shared-invoke"

const tbsParameter: PropertyString<"tbs"> = {
  type: "string",
  name: "tbs",
  display_name: {
    en_US: "Time-based Search",
    zh_Hans_CN: "基于时间的搜索",
  },
  ui: {
    component: "input",
    hint: {
      en_US:
        "Time-based parameter: qdr:h (hour), qdr:d (day), qdr:w (week), qdr:m (month), qdr:y (year), or custom: cdr:1,cd_min:MM/DD/YYYY,cd_max:MM/DD/YYYY",
      zh_Hans_CN:
        "基于时间的参数：qdr:h（小时）、qdr:d（天）、qdr:w（周）、qdr:m（月）、qdr:y（年），或自定义：cdr:1,cd_min:MM/DD/YYYY,cd_max:MM/DD/YYYY",
    },
    support_expression: true,
  },
}

const locationParameter: PropertyString<"location"> = {
  type: "string",
  name: "location",
  display_name: {
    en_US: "Location",
    zh_Hans_CN: "位置",
  },
  ui: {
    component: "input",
    hint: {
      en_US:
        "Location for geo-targeted results (e.g., 'San Francisco,California,United States')",
      zh_Hans_CN:
        "地理位置定位结果（例如：'San Francisco,California,United States'）",
    },
    support_expression: true,
  },
}

const categoriesParameter: PropertyArray<"categories"> = {
  type: "array",
  name: "categories",
  display_name: {
    en_US: "Categories",
    zh_Hans_CN: "类别",
  },
  items: {
    type: "discriminated_union",
    name: "category",
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
  } satisfies PropertyDiscriminatedUnion<"category", "type">,
}

const sourcesParameter: PropertyArray<"sources"> = {
  type: "array",
  name: "sources",
  display_name: {
    en_US: "Sources",
    zh_Hans_CN: "来源",
  },
  items: {
    type: "discriminated_union",
    name: "source",
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
  } satisfies PropertyDiscriminatedUnion<"source", "type">,
}

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
          display_name: {
            en_US: "Use Custom Body",
            zh_Hans_CN: "使用自定义请求体",
          },
          constant: false,
        },
        {
          type: "integer",
          name: "limit",
          display_name: {
            en_US: "Limit",
            zh_Hans_CN: "限制",
          },
          default: 5,
          minimum: 1,
          maximum: 100,
          ui: {
            component: "number-input",
            hint: {
              en_US: "Maximum number of results to return (1-100)",
              zh_Hans_CN: "返回结果的最大数量 (1-100)",
            },
            support_expression: true,
          },
        },
        sourcesParameter,
        categoriesParameter,
        tbsParameter,
        locationParameter,
        {
          type: "string",
          name: "country",
          display_name: {
            en_US: "Country",
            zh_Hans_CN: "国家",
          },
          default: "US",
          ui: {
            component: "input",
            hint: {
              en_US:
                "ISO country code for geo-targeting (e.g., US, DE, FR, JP, UK, CA)",
              zh_Hans_CN:
                "ISO 国家代码用于地理定位（例如：US、DE、FR、JP、UK、CA）",
            },
            support_expression: true,
          },
        },
        {
          type: "integer",
          name: "timeout",
          display_name: {
            en_US: "Timeout",
            zh_Hans_CN: "超时时间",
          },
          default: 60000,
          ui: {
            component: "number-input",
            hint: {
              en_US: "Timeout in milliseconds",
              zh_Hans_CN: "超时时间（毫秒）",
            },
            support_expression: true,
          },
        },
        {
          type: "boolean",
          name: "ignoreInvalidURLs",
          display_name: {
            en_US: "Ignore Invalid URLs",
            zh_Hans_CN: "忽略无效 URL",
          },
          default: false,
          ui: {
            component: "switch",
            hint: {
              en_US:
                "Excludes invalid URLs from search results that are invalid for other Firecrawl endpoints",
              zh_Hans_CN: "从搜索结果中排除对其他 Firecrawl 端点无效的 URL",
            },
            support_expression: true,
          },
        },
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

export const SearchContentTool: ToolDefinition = {
  name: "firecrawl-search",
  display_name: {
    en_US: "Firecrawl Search",
    zh_Hans_CN: "Firecrawl 搜索",
  },
  description: {
    en_US: "Search Firecrawl content with advanced filters.",
    zh_Hans_CN: "使用高级筛选搜索 Firecrawl 内容。",
  },
  icon: "🔎",
  parameters: [
    firecrawlCredentialParameter,
    {
      type: "string",
      name: "query",
      display_name: {
        en_US: "Query",
        zh_Hans_CN: "查询",
      },
      required: true,
      ui: {
        component: "textarea",
        hint: {
          en_US: "The search query",
          zh_Hans_CN: "搜索查询",
        },
        support_expression: true,
      },
    },
    options,
  ],
  invoke: notImplementedToolInvoke,
}
