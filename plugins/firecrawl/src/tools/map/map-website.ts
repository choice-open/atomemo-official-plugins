import type {
  PropertyDiscriminatedUnion,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  customBodyParameter,
  firecrawlCredentialParameter,
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
          name: "search",
          type: "string",
          display_name: {
            en_US: "Search",
            zh_Hans_CN: "搜索",
          },
          ui: {
            component: "input",
            hint: {
              en_US:
                "Specify a search query to order the results by relevance. Example: 'blog' will return URLs that contain the word 'blog' in the URL ordered by relevance.",
              zh_Hans_CN:
                "指定搜索查询以按相关性排序结果。例如：'blog' 将返回包含单词 'blog' 的 URL，按相关性排序。",
            },
            support_expression: true,
          },
        },
        {
          name: "sitemap",
          type: "string",
          display_name: {
            en_US: "Sitemap",
            zh_Hans_CN: "站点地图",
          },
          enum: ["skip", "include", "only"],
          default: "include",
          ui: {
            component: "select",
            hint: {
              en_US:
                "Sitemap mode when mapping. 'include' (default): Use sitemap and other methods. 'skip': Don't use sitemap. 'only': Only return URLs in the sitemap.",
              zh_Hans_CN:
                "映射时的站点地图模式。'include'（默认）：使用站点地图和其他方法。'skip'：不使用站点地图。'only'：仅返回站点地图中的 URL。",
            },
            support_expression: true,
          },
        },
        {
          name: "includeSubdomains",
          type: "boolean",
          display_name: {
            en_US: "Include Subdomains",
            zh_Hans_CN: "包含子域名",
          },
          default: true,
          ui: {
            component: "switch",
            hint: {
              en_US: "Include subdomains of the website",
              zh_Hans_CN: "包含网站的子域名",
            },
            support_expression: true,
          },
        },
        {
          name: "ignoreQueryParameters",
          type: "boolean",
          display_name: {
            en_US: "Ignore Query Parameters",
            zh_Hans_CN: "忽略查询参数",
          },
          default: true,
          ui: {
            component: "switch",
            hint: {
              en_US: "Do not return URLs with query parameters",
              zh_Hans_CN: "不返回带查询参数的 URL",
            },
            support_expression: true,
          },
        },
        {
          name: "limit",
          type: "integer",
          display_name: {
            en_US: "Limit",
            zh_Hans_CN: "限制",
          },
          default: 5000,
          ui: {
            component: "number-input",
            hint: {
              en_US:
                "Maximum number of links to return. Default is 5000. Maximum is 100000.",
              zh_Hans_CN: "返回的最大链接数。默认为 5000。最大为 100000。",
            },
            support_expression: true,
          },
        },
        {
          name: "timeout",
          type: "integer",
          display_name: {
            en_US: "Timeout",
            zh_Hans_CN: "超时",
          },
          default: 10000,
          ui: {
            component: "number-input",
            hint: {
              en_US: "Timeout in milliseconds. There is no timeout by default.",
              zh_Hans_CN: "超时时间（毫秒）。默认无超时。",
            },
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
  display_name: {
    en_US: "Firecrawl Map",
    zh_Hans_CN: "Firecrawl 网站地图",
  },
  description: {
    en_US: "Map a website by collecting links through Firecrawl.",
    zh_Hans_CN: "通过 Firecrawl 收集链接并映射网站结构。",
  },
  icon: "🗺️",
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
          en_US: "The base URL to start mapping from",
          zh_Hans_CN: "要开始映射的基础 URL",
        },
        support_expression: true,
      },
    },
    options,
  ],
  invoke: notImplementedToolInvoke,
}
