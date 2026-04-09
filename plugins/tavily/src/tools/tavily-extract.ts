import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import tavilyExtractSkill from "./tavily-extract-skill.md" with { type: "text" }
import { getTavilyClient } from "../tavily/tavily-client"
import {
  getTavilyApiKeyFromCredentials,
  parseCsvList,
  parseJsonObject,
  replaceUndefinedWithNull,
} from "../tavily/tavily-utils"

type TavilyExtractParameters = {
  tavily_credential?: string
  urls: string
  query?: string
  chunks_per_source?: number
  extract_depth?: string
  include_images?: boolean
  include_favicon?: boolean
  format?: string
  timeout?: number
  include_usage?: boolean
  advanced_options_json?: string
}

function resolveApiKey(args: { credentials?: unknown; parameters?: unknown }): string {
  const apiKey = getTavilyApiKeyFromCredentials(args.credentials)
  if (apiKey) return apiKey

  throw new Error(
    "Missing Tavily credentials. Create/select the `tavily` credential in the tool UI.",
  )
}

export const tavilyExtractTool: ToolDefinition = {
  name: "tavily-extract",
  display_name: { en_US: "Tavily Extract", zh_Hans: "Tavily 抓取" },
  description: {
    en_US: "Extract raw web content from URLs using Tavily",
    zh_Hans: "使用 Tavily 从 URL 提取网页内容",
  },
  skill: tavilyExtractSkill,
  icon: "📄",
  parameters: [
    {
      name: "tavily_credential",
      type: "credential_id",
      required: true,
      credential_name: "tavily",
      display_name: { en_US: "Tavily Credential", zh_Hans: "Tavily 凭证" },
      ui: { component: "credential-select" },
    },
    {
      name: "urls",
      type: "string",
      required: true,
      display_name: { en_US: "URLs", zh_Hans: "URL 列表" },
      ui: { component: "textarea", support_expression: true, width: "full" },
    },
    {
      name: "query",
      type: "string",
      required: false,
      display_name: { en_US: "Query (rerank)", zh_Hans: "查询（重排）" },
      ui: { component: "input", support_expression: true, width: "full" },
    },
    {
      name: "chunks_per_source",
      type: "integer",
      required: false,
      display_name: { en_US: "Chunks per source", zh_Hans: "每源块数" },
      ui: { component: "number-input" },
    },
    {
      name: "extract_depth",
      type: "string",
      required: false,
      display_name: { en_US: "Extract depth", zh_Hans: "抓取深度" },
      ui: { component: "input" },
      enum: ["basic", "advanced"],
    },
    {
      name: "format",
      type: "string",
      required: false,
      display_name: { en_US: "Format", zh_Hans: "格式" },
      ui: { component: "input" },
      enum: ["markdown", "text"],
    },
    {
      name: "include_images",
      type: "boolean",
      required: false,
      display_name: { en_US: "Include images", zh_Hans: "包含图片" },
      ui: { component: "checkbox" },
    },
    {
      name: "include_favicon",
      type: "boolean",
      required: false,
      display_name: { en_US: "Include favicon", zh_Hans: "包含站点图标" },
      ui: { component: "checkbox" },
    },
    {
      name: "timeout",
      type: "number",
      required: false,
      display_name: { en_US: "Timeout (seconds)", zh_Hans: "超时（秒）" },
      ui: { component: "number-input" },
    },
    {
      name: "include_usage",
      type: "boolean",
      required: false,
      display_name: { en_US: "Include usage", zh_Hans: "包含用量" },
      ui: { component: "checkbox" },
    },
    {
      name: "advanced_options_json",
      type: "string",
      required: false,
      display_name: { en_US: "Advanced options JSON", zh_Hans: "高级选项 JSON" },
      ui: { component: "code-editor", language: "json", support_expression: true, width: "full" },
    },
  ],
  async invoke({ args }) {
    const parameters = args.parameters as TavilyExtractParameters
    const apiKey = resolveApiKey({ credentials: args.credentials, parameters: args.parameters })

    const urls = parseCsvList(parameters.urls)
    if (!urls?.length) throw new Error("`urls` must include at least one URL.")

    const options: Record<string, unknown> = {}

    if (parameters.query) options.query = parameters.query
    if (typeof parameters.chunks_per_source === "number") options.chunksPerSource = parameters.chunks_per_source
    if (parameters.extract_depth) options.extractDepth = parameters.extract_depth
    if (typeof parameters.include_images === "boolean") options.includeImages = parameters.include_images
    if (typeof parameters.include_favicon === "boolean") options.includeFavicon = parameters.include_favicon
    if (parameters.format) options.format = parameters.format
    if (typeof parameters.timeout === "number") options.timeout = parameters.timeout
    if (typeof parameters.include_usage === "boolean") options.includeUsage = parameters.include_usage

    const extra = parseJsonObject(parameters.advanced_options_json)
    const finalOptions = extra ? { ...options, ...extra } : options

    const client = getTavilyClient(apiKey)
    const result = await client.extract(urls, finalOptions)
    return replaceUndefinedWithNull(result)
  },
}

