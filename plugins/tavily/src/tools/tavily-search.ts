import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import tavilySearchSkill from "./tavily-search-skill.md" with { type: "text" }
import { getTavilyClient } from "../tavily/tavily-client"
import {
  getTavilyApiKeyFromCredentials,
  parseCsvList,
  parseJsonObject,
  replaceUndefinedWithNull,
} from "../tavily/tavily-utils"

type TavilySearchParameters = {
  tavily_credential?: string
  query: string
  search_depth?: string
  max_results?: number
  topic?: string
  include_answer?: string | boolean
  include_raw_content?: string | boolean
  include_images?: boolean
  include_favicon?: boolean
  include_image_descriptions?: boolean
  include_domains?: string
  exclude_domains?: string
  exact_match?: boolean
  safe_search?: boolean
  auto_parameters?: boolean
  include_usage?: boolean
  advanced_options_json?: string
}

function resolveApiKey(args: { credentials?: unknown; parameters?: unknown }): string {
  const apiKey = getTavilyApiKeyFromCredentials(args.credentials)
  if (apiKey) return apiKey

  // Fallback: in case the host provides only parameters (no `args.credentials`).
  if (args.parameters && typeof args.parameters === "object") {
    const params = args.parameters as Record<string, unknown>
    const maybeKey = params.tavily_api_key
    if (typeof maybeKey === "string" && maybeKey.trim()) return maybeKey.trim()
  }

  throw new Error(
    "Missing Tavily credentials. Create/select the `tavily` credential in the tool UI.",
  )
}

export const tavilySearchTool: ToolDefinition = {
  name: "tavily-search",
  display_name: { en_US: "Tavily Search", zh_Hans: "Tavily 搜索" },
  description: { en_US: "Search the web using Tavily", zh_Hans: "使用 Tavily 搜索互联网" },
  skill: tavilySearchSkill,
  icon: "🔎",
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
      name: "query",
      type: "string",
      required: true,
      display_name: { en_US: "Query", zh_Hans: "查询" },
      ui: {
        component: "input",
        support_expression: true,
        placeholder: { en_US: "who is Leo Messi?", zh_Hans: "梅西是谁？" },
        width: "full",
      },
    },
    {
      name: "search_depth",
      type: "string",
      required: false,
      display_name: { en_US: "Search depth", zh_Hans: "搜索深度" },
      ui: { component: "input" },
      enum: ["advanced", "basic", "fast", "ultra-fast"],
    },
    {
      name: "max_results",
      type: "integer",
      required: false,
      display_name: { en_US: "Max results", zh_Hans: "最大结果数" },
      ui: { component: "number-input" },
    },
    {
      name: "topic",
      type: "string",
      required: false,
      display_name: { en_US: "Topic", zh_Hans: "主题" },
      ui: { component: "input" },
      enum: ["general", "news", "finance"],
    },
    {
      name: "include_answer",
      type: "string",
      required: false,
      display_name: { en_US: "Include answer", zh_Hans: "包含答案" },
      ui: { component: "input" },
      enum: ["basic", "advanced"],
    },
    {
      name: "include_raw_content",
      type: "string",
      required: false,
      display_name: { en_US: "Include raw content", zh_Hans: "包含原始内容" },
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
      name: "include_image_descriptions",
      type: "boolean",
      required: false,
      display_name: { en_US: "Image descriptions", zh_Hans: "图片描述" },
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
      name: "include_domains",
      type: "string",
      required: false,
      display_name: { en_US: "Include domains (CSV)", zh_Hans: "包含域名（CSV）" },
      ui: { component: "textarea", support_expression: true, width: "full" },
    },
    {
      name: "exclude_domains",
      type: "string",
      required: false,
      display_name: { en_US: "Exclude domains (CSV)", zh_Hans: "排除域名（CSV）" },
      ui: { component: "textarea", support_expression: true, width: "full" },
    },
    {
      name: "exact_match",
      type: "boolean",
      required: false,
      display_name: { en_US: "Exact match", zh_Hans: "精确匹配" },
      ui: { component: "checkbox" },
    },
    {
      name: "safe_search",
      type: "boolean",
      required: false,
      display_name: { en_US: "Safe search", zh_Hans: "安全搜索" },
      ui: { component: "checkbox" },
    },
    {
      name: "auto_parameters",
      type: "boolean",
      required: false,
      display_name: { en_US: "Auto parameters", zh_Hans: "自动参数" },
      ui: { component: "checkbox" },
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
    const parameters = args.parameters as TavilySearchParameters
    const apiKey = resolveApiKey({ credentials: args.credentials, parameters: args.parameters })

    const options: Record<string, unknown> = {}

    if (parameters.search_depth) options.searchDepth = parameters.search_depth
    if (typeof parameters.max_results === "number") options.maxResults = parameters.max_results
    if (parameters.topic) options.topic = parameters.topic

    if (parameters.include_answer !== undefined) options.includeAnswer = parameters.include_answer
    if (parameters.include_raw_content !== undefined) options.includeRawContent = parameters.include_raw_content

    if (typeof parameters.include_images === "boolean") options.includeImages = parameters.include_images
    if (typeof parameters.include_image_descriptions === "boolean")
      options.includeImageDescriptions = parameters.include_image_descriptions
    if (typeof parameters.include_favicon === "boolean") options.includeFavicon = parameters.include_favicon
    if (typeof parameters.exact_match === "boolean") options.exactMatch = parameters.exact_match
    if (typeof parameters.safe_search === "boolean") options.safeSearch = parameters.safe_search
    if (typeof parameters.auto_parameters === "boolean") options.autoParameters = parameters.auto_parameters
    if (typeof parameters.include_usage === "boolean") options.includeUsage = parameters.include_usage

    const includeDomains = parseCsvList(parameters.include_domains)
    if (includeDomains) options.includeDomains = includeDomains

    const excludeDomains = parseCsvList(parameters.exclude_domains)
    if (excludeDomains) options.excludeDomains = excludeDomains

    const extra = parseJsonObject(parameters.advanced_options_json)
    const finalOptions = extra ? { ...options, ...extra } : options

    const client = getTavilyClient(apiKey)
    const result = await client.search(parameters.query, finalOptions)
    return replaceUndefinedWithNull(result)
  },
}
