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

export const ScrapeAUrlAndGetItsContentTool: ToolDefinition = {
  name: "firecrawl-scrape",
  display_name: {
    en_US: "Firecrawl Scrape",
    zh_Hans_CN: "Firecrawl 爬取",
  },
  description: {
    en_US: "Scrape a URL and return the page content.",
    zh_Hans_CN: "爬取 URL 并返回页面内容。",
  },
  icon: "🧹",
  parameters: [
    firecrawlCredentialParameter,
    {
      type: "string",
      name: "url",
      display_name: {
        en_US: "URL",
        zh_Hans_CN: "URL",
      },
      required: true,
      ui: {
        component: "input",
        hint: {
          en_US: "The URL to scrape",
          zh_Hans_CN: "要爬取的 URL",
        },
        support_expression: true,
      },
    },
    options,
  ],
  invoke: notImplementedToolInvoke,
}
