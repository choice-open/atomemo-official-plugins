import type {
  JsonValue,
  Property,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../lib/request"

export const credentialParameter = {
  name: "credential_id",
  type: "credential_id",
  required: true,
  credential_name: "tikhub-api-key",
  display_name: { en_US: "Credential", zh_Hans: "凭证" },
  ui: { component: "credential-select" },
} satisfies Property<"credential_id">

export const searchBusinessTypeValues = [
  "all",
  "account",
  "article",
  "video",
  "live_stream",
  "moments",
  "news",
  "book",
  "listen",
  "image",
  "encyclopedia",
  "weixin_index",
] as const

export const searchSortValues = ["default", "latest", "hot"] as const
export const publishTimeValues = ["all", "day", "week", "half_year"] as const
export const videoDurationValues = ["all", "short", "medium", "long"] as const
export const articleItemShowTypeValues = ["0", "5", "7", "8"] as const

export function wechatStringParameter<Name extends string>(options: {
  name: Name
  required?: boolean
  default?: string
  displayName: { en_US: string; zh_Hans: string }
  hint: { en_US: string; zh_Hans: string }
  llmDescription: { en_US: string; zh_Hans: string }
  placeholder?: { en_US: string; zh_Hans: string }
}): Property<Name> {
  return {
    name: options.name,
    type: "string",
    required: options.required ?? false,
    ...(options.default !== undefined ? { default: options.default } : {}),
    display_name: options.displayName,
    ai: { llm_description: options.llmDescription },
    ui: {
      component: "input",
      hint: options.hint,
      placeholder: options.placeholder,
      support_expression: true,
      width: "full",
    },
  }
}

export function wechatIntegerParameter<Name extends string>(options: {
  name: Name
  required?: boolean
  default?: number
  min?: number
  max?: number
  displayName: { en_US: string; zh_Hans: string }
  hint: { en_US: string; zh_Hans: string }
  llmDescription: { en_US: string; zh_Hans: string }
}): Property<Name> {
  return {
    name: options.name,
    type: "integer",
    required: options.required ?? false,
    ...(options.default !== undefined ? { default: options.default } : {}),
    ...(options.min !== undefined ? { min: options.min } : {}),
    ...(options.max !== undefined ? { max: options.max } : {}),
    display_name: options.displayName,
    ai: { llm_description: options.llmDescription },
    ui: {
      component: "number-input",
      hint: options.hint,
      support_expression: true,
      width: "full",
    },
  }
}

export function wechatSelectParameter<Name extends string>(options: {
  name: Name
  values: readonly string[]
  required?: boolean
  default?: string
  displayName: { en_US: string; zh_Hans: string }
  hint: { en_US: string; zh_Hans: string }
  llmDescription: { en_US: string; zh_Hans: string }
}): Property<Name> {
  return {
    name: options.name,
    type: "string",
    required: options.required ?? false,
    ...(options.default !== undefined ? { default: options.default } : {}),
    enum: [...options.values],
    display_name: options.displayName,
    ai: { llm_description: options.llmDescription },
    ui: {
      component: "select",
      hint: options.hint,
      support_expression: true,
      width: "full",
    },
  }
}

export function wechatBooleanParameter<Name extends string>(options: {
  name: Name
  default: boolean
  displayName: { en_US: string; zh_Hans: string }
  hint: { en_US: string; zh_Hans: string }
  llmDescription: { en_US: string; zh_Hans: string }
}): Property<Name> {
  return {
    name: options.name,
    type: "boolean",
    required: false,
    default: options.default,
    display_name: options.displayName,
    ai: { llm_description: options.llmDescription },
    ui: {
      component: "switch",
      hint: options.hint,
      support_expression: true,
    },
  }
}

export const rawParameter = wechatBooleanParameter({
  name: "raw",
  default: true,
  displayName: { en_US: "Raw Response", zh_Hans: "原始响应" },
  hint: {
    en_US:
      "OpenAPI default is true. Set false for a simplified structure when doing analysis workflows.",
    zh_Hans: "OpenAPI 默认 true。分析工作流可设为 false 获取精简结构。",
  },
  llmDescription: {
    en_US:
      "Whether TikHub should return the raw upstream response. Default true. For analysis, raw=false may return flattened items and string-safe IDs.",
    zh_Hans:
      "是否返回 TikHub 原始上游响应，默认 true。分析场景可设 raw=false 获取拍平结构和更安全的字符串 ID。",
  },
})

export function readOptionalStringParam(
  params: Record<string, unknown>,
  name: string,
): string | undefined {
  const value = params[name]
  return typeof value === "string" ? value : undefined
}

export function readOptionalIntegerParam(
  params: Record<string, unknown>,
  name: string,
): number | undefined {
  const value = params[name]
  return typeof value === "number" && Number.isInteger(value)
    ? value
    : undefined
}

export function readOptionalBooleanParam(
  params: Record<string, unknown>,
  name: string,
): boolean | undefined {
  const value = params[name]
  return typeof value === "boolean" ? value : undefined
}

export function readOptionalStringIdParam(
  params: Record<string, unknown>,
  name: string,
): string | undefined {
  const value = readOptionalStringParam(params, name)
  return value === undefined ? undefined : value.trim()
}

export function readOfficialAccountUsername(
  params: Record<string, unknown>,
): string {
  const username = readOptionalStringIdParam(params, "username")
  if (!username) {
    throw new Error("username is required.")
  }
  return username.startsWith("gh_") ? username : `gh_${username}`
}

export function readFinderUsername(params: Record<string, unknown>): string {
  const username = readOptionalStringIdParam(params, "username")
  if (!username) {
    throw new Error("username is required.")
  }
  if (username.startsWith("v2_") && !username.endsWith("@finder")) {
    return `${username}@finder`
  }
  return username
}

export function readAtLeastOneStringParam(
  params: Record<string, unknown>,
  names: readonly string[],
): void {
  if (!names.some((name) => readOptionalStringIdParam(params, name))) {
    throw new Error(`Provide at least one of: ${names.join(", ")}.`)
  }
}

export async function invokeWeChatPost(
  endpoint: TikHubApiEndpoint,
  args: {
    credentials?: Record<string, unknown>
    parameters?: Record<string, unknown>
  },
  body: Record<string, unknown>,
): Promise<JsonValue> {
  const credentialId = readRequiredStringParam(
    args.parameters ?? {},
    "credential_id",
  )
  return invokeTikHubApi(endpoint, {
    credentials: args.credentials,
    credentialId,
    body,
  })
}
