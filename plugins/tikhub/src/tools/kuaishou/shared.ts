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

export const userRelationValues = [
  "all",
  "same_city",
  "verified",
  "live",
  "following",
] as const
export const userGenderValues = ["all", "male", "female"] as const
export const fansSortValues = [
  "default",
  "most_to_least",
  "least_to_most",
] as const
export const tagTabValues = ["hot", "latest", "image", "live"] as const
export const userPostSortValues = ["latest", "hot"] as const

export function kuaishouStringParameter<Name extends string>(options: {
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

export function kuaishouIntegerParameter<Name extends string>(options: {
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

export function kuaishouSelectParameter<Name extends string>(options: {
  name: Name
  values: readonly string[]
  default: string
  displayName: { en_US: string; zh_Hans: string }
  hint: { en_US: string; zh_Hans: string }
  llmDescription: { en_US: string; zh_Hans: string }
}): Property<Name> {
  return {
    name: options.name,
    type: "string",
    required: false,
    default: options.default,
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

export function readOptionalString(
  params: Record<string, unknown>,
  name: string,
): string | undefined {
  const value = params[name]
  return typeof value === "string" ? value : undefined
}

export function readRequiredString(
  params: Record<string, unknown>,
  name: string,
): string {
  const value = readOptionalString(params, name)?.trim()
  if (!value) {
    throw new Error(`${name} is required.`)
  }
  return value
}

export function readOptionalTrimmed(
  params: Record<string, unknown>,
  name: string,
): string | undefined {
  const value = readOptionalString(params, name)?.trim()
  return value ? value : undefined
}

export function readOpaqueCursor(
  params: Record<string, unknown>,
  name = "pcursor",
): string | undefined {
  return readOptionalString(params, name)
}

export function readEnum(
  params: Record<string, unknown>,
  name: string,
  values: readonly string[],
  defaultValue: string,
): string {
  const value = readOptionalString(params, name) ?? defaultValue
  if (!values.includes(value)) {
    throw new Error(`${name} must be one of ${values.join(", ")}.`)
  }
  return value
}

export function readInteger(
  params: Record<string, unknown>,
  name: string,
  defaultValue: number,
  limits?: { minimum?: number; maximum?: number },
): number {
  const value = params[name] ?? defaultValue
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(`${name} must be an integer.`)
  }
  if (limits?.minimum !== undefined && value < limits.minimum) {
    throw new Error(
      `${name} must be greater than or equal to ${limits.minimum}.`,
    )
  }
  if (limits?.maximum !== undefined && value > limits.maximum) {
    throw new Error(`${name} must be less than or equal to ${limits.maximum}.`)
  }
  return value
}

export function readNumericUserId(params: Record<string, unknown>): string {
  const userId = readRequiredString(params, "user_id")
  if (!/^\d+$/.test(userId)) {
    throw new Error(
      "user_id must be a numeric Kuaishou userId. Resolve eIDs with the user profile tool first.",
    )
  }
  return userId
}

export async function invokeKuaishouGet(
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

export const pcursorParameter = (withDefault = true) =>
  kuaishouStringParameter({
    name: "pcursor",
    ...(withDefault ? { default: "" } : {}),
    displayName: { en_US: "Pagination Cursor", zh_Hans: "分页游标" },
    hint: {
      en_US:
        "Leave empty for the first page. Pass the pcursor returned by the previous response unchanged.",
      zh_Hans: "第一页留空。翻页时将上一页响应的 pcursor 原样传回。",
    },
    llmDescription: {
      en_US:
        "Opaque pagination cursor. Never parse, decode, rewrite, or convert it to a number.",
      zh_Hans: "不透明分页游标。不要解析、解码、改写或转成 number。",
    },
    placeholder: { en_US: "Opaque pcursor", zh_Hans: "不透明 pcursor" },
  })
