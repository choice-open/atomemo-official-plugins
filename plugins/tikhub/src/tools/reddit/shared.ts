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

export const searchTypeValues = [
  "post",
  "community",
  "comment",
  "media",
  "people",
] as const
export const searchSortValues = [
  "RELEVANCE",
  "HOT",
  "TOP",
  "NEW",
  "COMMENTS",
] as const
export const searchTimeRangeValues = [
  "all",
  "year",
  "month",
  "week",
  "day",
  "hour",
] as const
export const safeSearchValues = ["unset", "strict"] as const
export const allowNsfwValues = ["0", "1"] as const
export const commentSortValues = [
  "CONFIDENCE",
  "NEW",
  "TOP",
  "HOT",
  "CONTROVERSIAL",
  "OLD",
  "RANDOM",
] as const
export const subredditFeedSortValues = [
  "BEST",
  "HOT",
  "NEW",
  "TOP",
  "CONTROVERSIAL",
  "RISING",
] as const
export const userContentSortValues = [
  "NEW",
  "TOP",
  "HOT",
  "CONTROVERSIAL",
] as const

export function redditStringParameter<Name extends string>(options: {
  name: Name
  required?: boolean
  default?: string
  pattern?: string
  displayName: { en_US: string; zh_Hans: string }
  hint: { en_US: string; zh_Hans: string }
  llmDescription: { en_US: string; zh_Hans: string }
  placeholder?: { en_US: string; zh_Hans: string }
  display?: Property<Name>["display"]
}): Property<Name> {
  return {
    name: options.name,
    type: "string",
    required: options.required ?? false,
    ...(options.default !== undefined ? { default: options.default } : {}),
    ...(options.pattern !== undefined ? { pattern: options.pattern } : {}),
    display_name: options.displayName,
    ...(options.display !== undefined ? { display: options.display } : {}),
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

export function redditIntegerParameter<Name extends string>(options: {
  name: Name
  required?: boolean
  default?: number
  displayName: { en_US: string; zh_Hans: string }
  hint: { en_US: string; zh_Hans: string }
  llmDescription: { en_US: string; zh_Hans: string }
}): Property<Name> {
  return {
    name: options.name,
    type: "integer",
    required: options.required ?? false,
    ...(options.default !== undefined ? { default: options.default } : {}),
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

export function redditSelectParameter<Name extends string>(options: {
  name: Name
  values: readonly string[]
  required?: boolean
  default?: string
  displayName: { en_US: string; zh_Hans: string }
  hint: { en_US: string; zh_Hans: string }
  llmDescription: { en_US: string; zh_Hans: string }
  display?: Property<Name>["display"]
}): Property<Name> {
  return {
    name: options.name,
    type: "string",
    required: options.required ?? false,
    ...(options.default !== undefined ? { default: options.default } : {}),
    enum: [...options.values],
    display_name: options.displayName,
    ...(options.display !== undefined ? { display: options.display } : {}),
    ai: { llm_description: options.llmDescription },
    ui: {
      component: "select",
      hint: options.hint,
      support_expression: true,
      width: "full",
    },
  }
}

export function redditBooleanParameter<Name extends string>(options: {
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

export const needFormatParameter = redditBooleanParameter({
  name: "need_format",
  default: false,
  displayName: { en_US: "Format Response", zh_Hans: "清洗格式化响应" },
  hint: {
    en_US: "OpenAPI default false. Set true to request TikHub-cleaned data.",
    zh_Hans: "OpenAPI 默认 false。设为 true 可请求 TikHub 清洗后的数据。",
  },
  llmDescription: {
    en_US:
      "Whether TikHub should clean and format the response. OpenAPI schema.default is false.",
    zh_Hans:
      "是否让 TikHub 清洗和格式化响应。OpenAPI schema.default 为 false。",
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

export function readTrimmedRequired(
  params: Record<string, unknown>,
  name: string,
  label: string,
): string {
  const value = readOptionalStringParam(params, name)?.trim()
  if (!value) {
    throw new Error(`${label} is required.`)
  }
  return value
}

export function readRedditPostId(params: Record<string, unknown>): string {
  const postId = readTrimmedRequired(params, "post_id", "post_id")
  if (!postId.startsWith("t3_")) {
    throw new Error("post_id must include the Reddit t3_ prefix.")
  }
  return postId
}

export function readRedditCommentId(
  params: Record<string, unknown>,
): string | undefined {
  const commentId = readOptionalStringParam(params, "comment_id")?.trim()
  if (!commentId) {
    return undefined
  }
  if (!commentId.startsWith("t1_")) {
    throw new Error("comment_id must include the Reddit t1_ prefix.")
  }
  return commentId
}

export function readSubredditName(
  params: Record<string, unknown>,
  options: { required: boolean; defaultValue?: string },
): string | undefined {
  const subredditName = readOptionalStringParam(
    params,
    "subreddit_name",
  )?.trim()
  if (!subredditName) {
    if (options.required) {
      throw new Error("subreddit_name is required.")
    }
    return options.defaultValue
  }
  if (subredditName.startsWith("r/")) {
    throw new Error("subreddit_name must not include the r/ prefix.")
  }
  return subredditName
}

export function readUsername(params: Record<string, unknown>): string {
  const username = readTrimmedRequired(params, "username", "username")
  if (username.startsWith("u/")) {
    throw new Error("username must not include the u/ prefix.")
  }
  return username
}

export async function invokeRedditGet(
  endpoint: TikHubApiEndpoint,
  args: {
    credentials?: Record<string, unknown>
    parameters?: Record<string, unknown>
  },
  queryParams: Record<string, string | undefined>,
): Promise<JsonValue> {
  const credentialId = readRequiredStringParam(
    args.parameters ?? {},
    "credential_id",
  )
  return invokeTikHubApi(endpoint, {
    credentials: args.credentials,
    credentialId,
    queryParams,
  })
}
