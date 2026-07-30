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

export const advancedSearchTypeValues = [
  "all",
  "hot",
  "original",
  "verified",
  "media",
  "viewpoint",
] as const

export const advancedIncludeTypeValues = [
  "all",
  "pic",
  "video",
  "music",
  "link",
] as const

export const userAuthValues = ["org_vip", "per_vip", "ord"] as const

export const userGenderValues = ["man", "women"] as const

export const userAgeValues = ["18y", "22y", "29y", "39y", "40y"] as const

export const longTextValues = ["true", "false"] as const

export const userPostFeatureValues = ["0", "1", "2", "3"] as const

export function weiboStringParameter<Name extends string>(options: {
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

export function weiboIntegerParameter<Name extends string>(options: {
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

export function weiboSelectParameter<Name extends string>(options: {
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

export const pageParameter = weiboIntegerParameter({
  name: "page",
  required: false,
  default: 1,
  displayName: { en_US: "Page", zh_Hans: "页码" },
  hint: {
    en_US: "Page number. Defaults to 1 for the first request.",
    zh_Hans: "页码。首次请求默认 1。",
  },
  llmDescription: {
    en_US: "Page number for Weibo pagination. Default is 1.",
    zh_Hans: "微博分页页码，默认 1。",
  },
})

export const countParameter = (label: "comments" | "sub-comments") =>
  weiboIntegerParameter({
    name: "count",
    required: false,
    default: 10,
    displayName: { en_US: "Count", zh_Hans: "数量" },
    hint: {
      en_US: `Number of ${label} to fetch. Defaults to 10.`,
      zh_Hans:
        label === "comments"
          ? "一级评论数量，默认 10。"
          : "子评论数量，默认 10。",
    },
    llmDescription: {
      en_US: `Number of ${label} requested from TikHub. Default is 10.`,
      zh_Hans:
        label === "comments"
          ? "请求的一级评论数量，默认 10。"
          : "请求的子评论数量，默认 10。",
    },
  })

export const maxIdParameter = weiboStringParameter({
  name: "max_id",
  required: false,
  default: "",
  displayName: { en_US: "Max ID", zh_Hans: "分页 max_id" },
  hint: {
    en_US:
      "Leave empty for the first request. For pagination, pass the max_id from the previous response unchanged.",
    zh_Hans: "首次请求留空。翻页时原样传入上次响应返回的 max_id。",
  },
  llmDescription: {
    en_US:
      "Opaque Weibo pagination value. Pass the previous response max_id exactly as returned; do not parse or rewrite it.",
    zh_Hans:
      "微博不透明分页值。必须原样传入上次响应返回的 max_id，不要解析或改写。",
  },
  placeholder: { en_US: "Leave empty for first page", zh_Hans: "首次请求留空" },
})

export const optionalMaxIdParameter = weiboStringParameter({
  name: "max_id",
  required: false,
  displayName: { en_US: "Max ID", zh_Hans: "分页 max_id" },
  hint: {
    en_US:
      "Leave empty for the first request. For pagination, pass the max_id from the previous response unchanged.",
    zh_Hans: "首次请求留空。翻页时原样传入上次响应返回的 max_id。",
  },
  llmDescription: {
    en_US:
      "Opaque Weibo pagination value. Pass the previous response max_id exactly as returned; do not parse or rewrite it.",
    zh_Hans:
      "微博不透明分页值。必须原样传入上次响应返回的 max_id，不要解析或改写。",
  },
  placeholder: { en_US: "Leave empty for first page", zh_Hans: "首次请求留空" },
})

export const postIdParameter = weiboStringParameter({
  name: "id",
  required: true,
  displayName: { en_US: "Weibo Post ID", zh_Hans: "微博 ID" },
  hint: {
    en_US: "Weibo post ID, passed as a string to avoid numeric precision loss.",
    zh_Hans: "微博 ID，以字符串传递，避免数字精度丢失。",
  },
  llmDescription: {
    en_US:
      "Weibo post ID. It must be supplied as a string and should not be converted to a number.",
    zh_Hans: "微博 ID。必须以字符串提供，不要转换为数字。",
  },
})

export const uidParameter = weiboStringParameter({
  name: "uid",
  required: true,
  displayName: { en_US: "User ID", zh_Hans: "用户 ID" },
  hint: {
    en_US: "Weibo uid, passed as a string to avoid numeric precision loss.",
    zh_Hans: "微博 uid，以字符串传递，避免数字精度丢失。",
  },
  llmDescription: {
    en_US:
      "Weibo uid. Provide it as a string for user profile or historical posts.",
    zh_Hans: "微博 uid。用于用户资料或历史微博查询，请以字符串提供。",
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
): string | undefined {
  const value = params[name]
  return typeof value === "number" && Number.isInteger(value)
    ? String(value)
    : undefined
}

export function readRequiredIdStringParam(
  params: Record<string, unknown>,
  name: string,
): string {
  const value = params[name]
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${name} is required and must be provided as a string.`)
  }
  return value.trim()
}

export function readUserIdOrCustom(params: Record<string, unknown>): {
  uid?: string
  custom?: string
} {
  const uid = readOptionalStringParam(params, "uid")?.trim()
  const custom = readOptionalStringParam(params, "custom")?.trim()
  if (!uid && !custom) {
    throw new Error("Provide at least one of uid or custom.")
  }
  return {
    ...(uid ? { uid } : {}),
    ...(uid ? {} : custom ? { custom } : {}),
  }
}

export function invokeWeiboGet(
  endpoint: TikHubApiEndpoint,
  args: {
    parameters?: unknown
    credentials?: Record<string, unknown>
  },
  queryParams: Record<string, string | undefined>,
): Promise<JsonValue> {
  const p = (args.parameters ?? {}) as Record<string, unknown>
  const credentialId = readRequiredStringParam(p, "credential_id")
  return invokeTikHubApi(endpoint, {
    credentials: args.credentials,
    credentialId,
    queryParams,
  })
}
