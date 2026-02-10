import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { notImplementedToolInvoke } from "../_shared-invoke"
import { firecrawlCredentialParameter } from "../_shared-parameters"

export const PreviewCrawlParamsTool: ToolDefinition = {
  name: "firecrawl-preview-crawl-params",
  display_name: {
    en_US: "Firecrawl Preview Crawl Params",
    zh_Hans_CN: "Firecrawl 预览爬取参数",
  },
  description: {
    en_US: "Preview how Firecrawl would interpret the crawl parameters.",
    zh_Hans_CN: "预览 Firecrawl 解析爬取参数的方式。",
  },
  icon: "🔍",
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
          en_US: "The URL to crawl (base URL).",
          zh_Hans_CN: "要爬取的基础 URL。",
        },
        support_expression: true,
      },
    },
    {
      type: "string",
      name: "prompt",
      display_name: {
        en_US: "Prompt",
        zh_Hans_CN: "提示词",
      },
      required: true,
      max_length: 10000,
      ui: {
        component: "textarea",
        hint: {
          en_US:
            "Natural language description of what to crawl. Max length 10000 characters.",
          zh_Hans_CN: "用自然语言描述要爬取的内容。最大长度 10000 字符。",
        },
        support_expression: true,
      },
    },
  ],
  invoke: notImplementedToolInvoke,
}
