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
  display_name: {
    en_US: "URLs",
    zh_Hans_CN: "URL列表",
  },
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
  display_name: {
    en_US: "Firecrawl Batch Scrape",
    zh_Hans_CN: "Firecrawl 批量爬取",
  },
  description: {
    en_US: "Scrape multiple URLs in a batch job.",
    zh_Hans_CN: "在批量作业中爬取多个 URL。",
  },
  icon: "📡",
  parameters: [firecrawlCredentialParameter, urlsParameter, options],
  invoke: notImplementedToolInvoke,
}
