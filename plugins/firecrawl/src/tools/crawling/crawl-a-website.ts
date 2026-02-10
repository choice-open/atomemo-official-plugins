import type {
  PropertyDiscriminatedUnion,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  customBodyParameter,
  firecrawlCredentialParameter,
  scrapeOptionsParameter,
} from "../_shared-parameters"
import { notImplementedToolInvoke } from "../_shared-invoke"

const requestOptions: PropertyDiscriminatedUnion<
  "requestOptions",
  "useCustomBody"
> = {
  name: "requestOptions",
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
          name: "prompt",
          type: "string",
          display_name: {
            en_US: "Prompt",
            zh_Hans_CN: "提示词",
          },
          ui: {
            component: "input",
            hint: {
              en_US:
                "Describe what to crawl in plain English. Explicitly set parameters will override generated equivalents.",
              zh_Hans_CN:
                "用自然语言描述要爬取的内容。显式设置的参数将覆盖生成的等效参数。",
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
          default: 10000,
          ui: {
            component: "number-input",
            hint: {
              en_US: "Maximum number of pages to crawl. Default is 10000.",
              zh_Hans_CN: "最大爬取页面数。默认为 10000。",
            },
            support_expression: true,
          },
        },
        {
          name: "delay",
          type: "integer",
          display_name: {
            en_US: "Delay",
            zh_Hans_CN: "延迟",
          },
          ui: {
            component: "number-input",
            hint: {
              en_US:
                "Delay in seconds between scrapes. This helps respect website rate limits.",
              zh_Hans_CN: "抓取之间的延迟（秒）。这有助于遵守网站的速率限制。",
            },
            support_expression: true,
          },
        },
        {
          name: "maxConcurrency",
          type: "integer",
          display_name: {
            en_US: "Max Concurrency",
            zh_Hans_CN: "最大并发数",
          },
          ui: {
            component: "number-input",
            hint: {
              en_US:
                "Maximum number of concurrent scrapes. If not specified, the crawl adheres to your team's concurrency limit.",
              zh_Hans_CN:
                "最大并发抓取数。如果未指定，爬取将遵守您团队的并发限制。",
            },
            support_expression: true,
          },
        },
        {
          name: "excludePaths",
          type: "array",
          display_name: {
            en_US: "Exclude Paths",
            zh_Hans_CN: "排除路径",
          },
          items: {
            type: "string",
            name: "excludePath",
          },
          ui: {
            component: "array-section",
            hint: {
              en_US:
                "URL pathname regex patterns that exclude matching URLs from the crawl. e.g., 'blog/.*' to exclude all blog pages.",
              zh_Hans_CN:
                "排除匹配 URL 的路径正则表达式模式。例如，'blog/.*' 可排除所有博客页面。",
            },
          },
        },
        {
          name: "includePaths",
          type: "array",
          display_name: {
            en_US: "Include Paths",
            zh_Hans_CN: "包含路径",
          },
          items: {
            type: "string",
            name: "includePath",
          },
          ui: {
            component: "array-section",
            hint: {
              en_US:
                "URL pathname regex patterns that include matching URLs in the crawl. Only paths matching the patterns will be included. e.g., 'blog/.*' to include only blog pages.",
              zh_Hans_CN:
                "包含匹配 URL 的路径正则表达式模式。仅包含匹配模式的路径。例如，'blog/.*' 仅包含博客页面。",
            },
          },
        },
        {
          name: "sitemap",
          type: "string",
          display_name: {
            en_US: "Sitemap",
            zh_Hans_CN: "站点地图",
          },
          enum: ["include", "skip"],
          default: "include",
          ui: {
            component: "select",
            hint: {
              en_US:
                "Sitemap mode. 'include' (default): Use sitemap and discover other pages. 'skip': Ignore sitemap entirely.",
              zh_Hans_CN:
                "站点地图模式。'include'（默认）：使用站点地图并发现其他页面。'skip'：完全忽略站点地图。",
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
          default: false,
          ui: {
            component: "switch",
            hint: {
              en_US:
                "Do not re-scrape the same path with different (or none) query parameters.",
              zh_Hans_CN: "不重复抓取具有不同（或无）查询参数的相同路径。",
            },
            support_expression: true,
          },
        },
        {
          name: "allowExternalLinks",
          type: "boolean",
          display_name: {
            en_US: "Allow External Links",
            zh_Hans_CN: "允许外部链接",
          },
          default: false,
          ui: {
            component: "switch",
            hint: {
              en_US: "Allows the crawler to follow links to external websites.",
              zh_Hans_CN: "允许爬虫跟随外部网站的链接。",
            },
            support_expression: true,
          },
        },
        {
          name: "allowSubdomains",
          type: "boolean",
          display_name: {
            en_US: "Allow Subdomains",
            zh_Hans_CN: "允许子域名",
          },
          default: false,
          ui: {
            component: "switch",
            hint: {
              en_US:
                "Allows the crawler to follow links to subdomains of the main domain.",
              zh_Hans_CN: "允许爬虫跟随主域名的子域名链接。",
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

export const CrawlAWebsiteTool: ToolDefinition = {
  name: "firecrawl-crawl",
  display_name: {
    en_US: "Firecrawl Crawl",
    zh_Hans_CN: "Firecrawl 爬取网站",
  },
  description: {
    en_US: "Crawl a website using Firecrawl with fine-grained controls.",
    zh_Hans_CN: "使用 Firecrawl 以细粒度配置爬取网站。",
  },
  icon: "🕸️",
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
          en_US: "The base URL to start crawling from",
          zh_Hans_CN: "要开始爬取的基础 URL",
        },
        support_expression: true,
      },
    },
    requestOptions,
  ],
  invoke: notImplementedToolInvoke,
}
