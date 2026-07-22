import type { Property } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

export const credentialParameter = {
  name: "credential_id",
  type: "credential_id",
  required: true,
  credential_name: "tikhub-api-key",
  display_name: { en_US: "Credential", zh_Hans: "凭证" },
  ui: { component: "credential-select" },
} satisfies Property<"credential_id">

export function stringParameter(options: {
  name: string
  required?: boolean
  default?: string
  displayName: { en_US: string; zh_Hans: string }
  description: { en_US: string; zh_Hans: string }
  hint: { en_US: string; zh_Hans: string }
  placeholder?: { en_US: string; zh_Hans: string }
}): Property<string> {
  return {
    name: options.name,
    type: "string",
    required: options.required ?? false,
    default: options.default,
    display_name: options.displayName,
    ai: { llm_description: options.description },
    ui: {
      hint: options.hint,
      support_expression: true,
      component: "input",
      placeholder: options.placeholder,
      width: "full",
    },
  }
}

export function integerParameter(options: {
  name: string
  default: number
  displayName: { en_US: string; zh_Hans: string }
  description: { en_US: string; zh_Hans: string }
  hint: { en_US: string; zh_Hans: string }
}): Property<string> {
  return {
    name: options.name,
    type: "integer",
    required: false,
    default: options.default,
    display_name: options.displayName,
    ai: { llm_description: options.description },
    ui: {
      hint: options.hint,
      support_expression: true,
      component: "number-input",
    },
  }
}

export const offsetParameter = integerParameter({
  name: "offset",
  default: 0,
  displayName: { en_US: "Offset", zh_Hans: "偏移量" },
  description: {
    en_US: "Pagination offset, starting from 0.",
    zh_Hans: "分页偏移量，从 0 开始。",
  },
  hint: {
    en_US: "Pagination offset, default 0.",
    zh_Hans: "分页偏移量，默认 0。",
  },
})

export const cursorParameter = integerParameter({
  name: "cursor",
  default: 0,
  displayName: { en_US: "Cursor", zh_Hans: "游标" },
  description: {
    en_US: "Pagination cursor, starting from 0.",
    zh_Hans: "分页游标，从 0 开始。",
  },
  hint: {
    en_US: "Pagination cursor, default 0.",
    zh_Hans: "分页游标，默认 0。",
  },
})

export const countParameter = integerParameter({
  name: "count",
  default: 20,
  displayName: { en_US: "Count", zh_Hans: "数量" },
  description: {
    en_US: "Number of results per page, default 20.",
    zh_Hans: "每页结果数量，默认 20。",
  },
  hint: { en_US: "Number of results per page.", zh_Hans: "每页结果数量。" },
})

export const keywordParameter = stringParameter({
  name: "keyword",
  required: true,
  displayName: { en_US: "Keyword", zh_Hans: "搜索关键词" },
  description: {
    en_US: "TikTok search keyword.",
    zh_Hans: "TikTok 搜索关键词。",
  },
  hint: { en_US: "Search keyword.", zh_Hans: "搜索关键词。" },
  placeholder: { en_US: "e.g. food", zh_Hans: "如：food" },
})

export const regionParameter = stringParameter({
  name: "region",
  default: "US",
  displayName: { en_US: "Region", zh_Hans: "地区" },
  description: {
    en_US: "TikTok country or region code, default US.",
    zh_Hans: "TikTok 国家或地区代码，默认 US。",
  },
  hint: {
    en_US: "Country or region code, default US.",
    zh_Hans: "国家或地区代码，默认 US。",
  },
  placeholder: { en_US: "US", zh_Hans: "US" },
})

export function readCredentialId(params: Record<string, unknown>): string {
  return readRequiredStringParam(params, "credential_id")
}

export function readOptionalStringParam(
  params: Record<string, unknown>,
  name: string,
): string | undefined {
  const value = params[name]
  if (typeof value !== "string") {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed === "" ? undefined : trimmed
}

export function readOptionalIntegerParam(
  params: Record<string, unknown>,
  name: string,
): string | undefined {
  const value = params[name]
  return typeof value === "number" ? String(value) : undefined
}

export function splitCommaSeparated(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export async function invokeTikTokGet(
  endpoint: TikHubApiEndpoint,
  args: { parameters?: unknown; credentials?: Record<string, unknown> },
  queryParams: Record<string, string | undefined>,
) {
  const params = (args.parameters ?? {}) as Record<string, unknown>
  return invokeTikHubApi(endpoint, {
    credentials: args.credentials,
    credentialId: readCredentialId(params),
    queryParams,
  })
}
