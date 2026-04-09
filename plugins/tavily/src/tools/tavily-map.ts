import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import tavilyMapSkill from "./tavily-map-skill.md" with { type: "text" }
import { getTavilyClient } from "../tavily/tavily-client"
import {
  getTavilyApiKeyFromCredentials,
  parseCsvList,
  parseJsonObject,
  replaceUndefinedWithNull,
} from "../tavily/tavily-utils"

type TavilyMapParameters = {
  tavily_credential?: string
  url: string
  instructions?: string
  max_depth?: number
  max_breadth?: number
  limit?: number
  select_paths?: string
  select_domains?: string
  exclude_paths?: string
  exclude_domains?: string
  allow_external?: boolean
  timeout?: number
  include_usage?: boolean
  advanced_options_json?: string
}

function resolveApiKey(args: { credentials?: unknown }): string {
  const apiKey = getTavilyApiKeyFromCredentials(args.credentials)
  if (apiKey) return apiKey
  throw new Error("Missing Tavily credentials. Create/select the `tavily` credential in the tool UI.")
}

export const tavilyMapTool: ToolDefinition = {
  name: "tavily-map",
  display_name: { en_US: "Tavily Map", zh_Hans: "Tavily 地图" },
  description: { en_US: "Map websites using Tavily", zh_Hans: "使用 Tavily 生成网站地图" },
  skill: tavilyMapSkill,
  icon: "🗺️",
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
      name: "url",
      type: "string",
      required: true,
      display_name: { en_US: "Root URL", zh_Hans: "起始 URL" },
      ui: { component: "input", support_expression: true, placeholder: { en_US: "https://example.com", zh_Hans: "https://example.com" }, width: "full" },
    },
    {
      name: "instructions",
      type: "string",
      required: false,
      display_name: { en_US: "Instructions", zh_Hans: "指令" },
      ui: { component: "textarea", support_expression: true, width: "full" },
    },
    {
      name: "max_depth",
      type: "integer",
      required: false,
      display_name: { en_US: "Max depth", zh_Hans: "最大深度" },
      ui: { component: "number-input" },
    },
    {
      name: "max_breadth",
      type: "integer",
      required: false,
      display_name: { en_US: "Max breadth", zh_Hans: "最大宽度" },
      ui: { component: "number-input" },
    },
    {
      name: "limit",
      type: "integer",
      required: false,
      display_name: { en_US: "Limit", zh_Hans: "限制" },
      ui: { component: "number-input" },
    },
    {
      name: "select_paths",
      type: "string",
      required: false,
      display_name: { en_US: "Select paths (CSV)", zh_Hans: "选择路径（CSV）" },
      ui: { component: "textarea", support_expression: true, width: "full" },
    },
    {
      name: "select_domains",
      type: "string",
      required: false,
      display_name: { en_US: "Select domains (CSV)", zh_Hans: "选择域名（CSV）" },
      ui: { component: "textarea", support_expression: true, width: "full" },
    },
    {
      name: "exclude_paths",
      type: "string",
      required: false,
      display_name: { en_US: "Exclude paths (CSV)", zh_Hans: "排除路径（CSV）" },
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
      name: "allow_external",
      type: "boolean",
      required: false,
      display_name: { en_US: "Allow external", zh_Hans: "允许外部域名" },
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
    const parameters = args.parameters as TavilyMapParameters
    const apiKey = resolveApiKey({ credentials: args.credentials })

    const options: Record<string, unknown> = {}

    if (parameters.instructions) options.instructions = parameters.instructions
    if (typeof parameters.max_depth === "number") options.maxDepth = parameters.max_depth
    if (typeof parameters.max_breadth === "number") options.maxBreadth = parameters.max_breadth
    if (typeof parameters.limit === "number") options.limit = parameters.limit

    const selectPaths = parseCsvList(parameters.select_paths)
    if (selectPaths) options.selectPaths = selectPaths

    const selectDomains = parseCsvList(parameters.select_domains)
    if (selectDomains) options.selectDomains = selectDomains

    const excludePaths = parseCsvList(parameters.exclude_paths)
    if (excludePaths) options.excludePaths = excludePaths

    const excludeDomains = parseCsvList(parameters.exclude_domains)
    if (excludeDomains) options.excludeDomains = excludeDomains

    if (typeof parameters.allow_external === "boolean") options.allowExternal = parameters.allow_external
    if (typeof parameters.timeout === "number") options.timeout = parameters.timeout
    if (typeof parameters.include_usage === "boolean") options.includeUsage = parameters.include_usage

    const extra = parseJsonObject(parameters.advanced_options_json)
    const finalOptions = extra ? { ...options, ...extra } : options

    const client = getTavilyClient(apiKey)
    const result = await client.map(parameters.url, finalOptions)
    return replaceUndefinedWithNull(result)
  },
}

