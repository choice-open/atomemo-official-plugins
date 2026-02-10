import type {
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
          type: "string",
          name: "prompt",
          display_name: {
            en_US: "Prompt",
            zh_Hans_CN: "提示语",
          },
          ui: {
            component: "textarea",
            hint: {
              en_US: "Prompt to guide the extraction process",
              zh_Hans_CN: "指导提取过程的提示语",
            },
            support_expression: true,
          },
        },
        {
          type: "string",
          name: "schema",
          display_name: {
            en_US: "Schema (JSON)",
            zh_Hans_CN: "模式（JSON）",
          },
          ui: {
            component: "code-editor",
            language: "json",
            hint: {
              en_US:
                "JSON Schema to define the structure of the extracted data",
              zh_Hans_CN: "定义提取数据结构的 JSON 模式",
            },
            line_numbers: true,
            support_expression: true,
          },
          default: "{}",
        },
        {
          type: "boolean",
          name: "enableWebSearch",
          display_name: {
            en_US: "Enable Web Search",
            zh_Hans_CN: "启用网络搜索",
          },
          default: false,
          ui: {
            component: "switch",
            hint: {
              en_US:
                "When true, the extraction will use web search to find additional data",
              zh_Hans_CN: "启用时，提取将使用网络搜索来查找额外数据",
            },
            support_expression: true,
          },
        },
        {
          type: "boolean",
          name: "ignoreSitemap",
          display_name: {
            en_US: "Ignore Sitemap",
            zh_Hans_CN: "忽略网站地图",
          },
          default: false,
          ui: {
            component: "switch",
            hint: {
              en_US: "When true, sitemap.xml files will be ignored",
              zh_Hans_CN: "启用时，将忽略 sitemap.xml 文件",
            },
            support_expression: true,
          },
        },
        {
          type: "boolean",
          name: "includeSubdomains",
          display_name: {
            en_US: "Include Subdomains",
            zh_Hans_CN: "包含子域名",
          },
          default: true,
          ui: {
            component: "switch",
            hint: {
              en_US: "When true, subdomains will also be scanned",
              zh_Hans_CN: "启用时，子域名也将被扫描",
            },
            support_expression: true,
          },
        },
        {
          type: "boolean",
          name: "showSources",
          display_name: {
            en_US: "Show Sources",
            zh_Hans_CN: "显示来源",
          },
          default: false,
          ui: {
            component: "switch",
            hint: {
              en_US:
                "When true, the sources used to extract the data will be included in the response",
              zh_Hans_CN: "启用时，用于提取数据的来源将包含在响应中",
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
          default: true,
          ui: {
            component: "switch",
            hint: {
              en_US:
                "When true, invalid URLs will be ignored instead of failing the entire request",
              zh_Hans_CN: "启用时，无效 URL 将被忽略而不是使整个请求失败",
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

const urlsParameters: PropertyString<"urls"> = {
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

export const ExtractStructuredDataTool: ToolDefinition = {
  name: "firecrawl-extract",
  display_name: {
    en_US: "Firecrawl Extract",
    zh_Hans_CN: "Firecrawl 提取数据",
  },
  description: {
    en_US: "Extract structured data from a list of URLs.",
    zh_Hans_CN: "从一系列 URL 中提取结构化数据。",
  },
  icon: "📦",
  parameters: [firecrawlCredentialParameter, urlsParameters, options],
  invoke: notImplementedToolInvoke,
}
