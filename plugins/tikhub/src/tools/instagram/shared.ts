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

export const searchSelectValues = ["users", "hashtags", "places"] as const
export const commentSortOrderValues = ["popular", "recent"] as const

export function instagramStringParameter<Name extends string>(options: {
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

export function instagramIntegerParameter<Name extends string>(options: {
  name: Name
  required?: boolean
  default?: number
  minimum?: number
  maximum?: number
  displayName: { en_US: string; zh_Hans: string }
  hint: { en_US: string; zh_Hans: string }
  llmDescription: { en_US: string; zh_Hans: string }
}): Property<Name> {
  return {
    name: options.name,
    type: "integer",
    required: options.required ?? false,
    ...(options.default !== undefined ? { default: options.default } : {}),
    ...(options.minimum !== undefined ? { minimum: options.minimum } : {}),
    ...(options.maximum !== undefined ? { maximum: options.maximum } : {}),
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

export function instagramSelectParameter<Name extends string>(options: {
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

export function readHashtag(params: Record<string, unknown>): string {
  const hashtag = readTrimmedRequired(params, "hashtag", "hashtag")
  if (hashtag.startsWith("#")) {
    throw new Error("hashtag must not include the # prefix.")
  }
  return hashtag
}

export function readCount(params: Record<string, unknown>): number {
  const count = readOptionalIntegerParam(params, "count") ?? 12
  if (count < 1 || count > 50) {
    throw new Error("count must be between 1 and 50.")
  }
  return count
}

export function readSearchSelect(
  params: Record<string, unknown>,
): string | undefined {
  const select = readOptionalStringParam(params, "select")?.trim()
  if (!select) {
    return undefined
  }
  if (
    !searchSelectValues.includes(select as (typeof searchSelectValues)[number])
  ) {
    throw new Error("select must be one of users, hashtags, or places.")
  }
  return select
}

export function readCommentSortOrder(params: Record<string, unknown>): string {
  const sortOrder = readOptionalStringParam(params, "sort_order") ?? "recent"
  if (
    !commentSortOrderValues.includes(
      sortOrder as (typeof commentSortOrderValues)[number],
    )
  ) {
    throw new Error("sort_order must be one of popular or recent.")
  }
  return sortOrder
}

export async function invokeInstagramGet(
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
