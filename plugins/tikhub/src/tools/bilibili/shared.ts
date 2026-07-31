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

export const generalSearchOrderValues = [
  "totalrank",
  "click",
  "pubdate",
  "dm",
  "stow",
] as const
export const generalSearchDurationValues = [0, 1, 2, 3, 4] as const
export const userVideoOrderValues = ["pubdate", "click", "stow"] as const

export function bilibiliStringParameter<Name extends string>(options: {
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

export function bilibiliIntegerParameter<Name extends string>(options: {
  name: Name
  required?: boolean
  default?: number
  minimum?: number
  maximum?: number
  enum?: number[]
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
    ...(options.enum !== undefined ? { enum: options.enum } : {}),
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

export function bilibiliSelectParameter<Name extends string>(options: {
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

export function readOptionalTrimmed(
  params: Record<string, unknown>,
  name: string,
): string | undefined {
  const value = readOptionalStringParam(params, name)?.trim()
  return value ? value : undefined
}

export function readUserVideoOrder(params: Record<string, unknown>): string {
  const order = readOptionalStringParam(params, "order") ?? "pubdate"
  if (
    !userVideoOrderValues.includes(
      order as (typeof userVideoOrderValues)[number],
    )
  ) {
    throw new Error("order must be one of pubdate, click, or stow.")
  }
  return order
}

export function readGeneralSearchOrder(
  params: Record<string, unknown>,
): string {
  const order = readOptionalStringParam(params, "order")?.trim()
  if (
    !order ||
    !generalSearchOrderValues.includes(
      order as (typeof generalSearchOrderValues)[number],
    )
  ) {
    throw new Error(
      "order must be one of totalrank, click, pubdate, dm, or stow.",
    )
  }
  return order
}

export function readGeneralSearchDuration(
  params: Record<string, unknown>,
): number {
  const duration = readOptionalIntegerParam(params, "duration") ?? 0
  if (
    !generalSearchDurationValues.includes(
      duration as (typeof generalSearchDurationValues)[number],
    )
  ) {
    throw new Error("duration must be one of 0, 1, 2, 3, or 4.")
  }
  return duration
}

export function readRequiredIntegerParam(
  params: Record<string, unknown>,
  name: string,
  label: string,
): number {
  const value = readOptionalIntegerParam(params, name)
  if (value === undefined) {
    throw new Error(`${label} is required.`)
  }
  return value
}

export function readOptionalNonNegativeInteger(
  params: Record<string, unknown>,
  name: string,
): number {
  const value = readOptionalIntegerParam(params, name) ?? 0
  if (value < 0) {
    throw new Error(`${name} must be greater than or equal to 0.`)
  }
  return value
}

export function readPageNumber(params: Record<string, unknown>): number {
  const pn = readOptionalIntegerParam(params, "pn") ?? 1
  if (pn < 1) {
    throw new Error("pn must be greater than or equal to 1.")
  }
  return pn
}

export function readPageSize(params: Record<string, unknown>): number {
  const pageSize = readOptionalIntegerParam(params, "page_size") ?? 20
  if (pageSize < 1) {
    throw new Error("page_size must be greater than or equal to 1.")
  }
  return pageSize
}

export const bvIdParameter = bilibiliStringParameter({
  name: "bv_id",
  required: true,
  displayName: { en_US: "BV ID", zh_Hans: "BV 号" },
  hint: {
    en_US: "Required Bilibili BV ID, for example BV1M1421t7hT.",
    zh_Hans: "必填 Bilibili BV 号，例如 BV1M1421t7hT。",
  },
  llmDescription: {
    en_US:
      "Required Bilibili BV ID. Treat it as a string and never rewrite it.",
    zh_Hans: "必填 Bilibili BV 号。按字符串处理，不要改写。",
  },
  placeholder: { en_US: "BV1M1421t7hT", zh_Hans: "BV1M1421t7hT" },
})

export const uidParameter = bilibiliStringParameter({
  name: "uid",
  required: true,
  displayName: { en_US: "UID", zh_Hans: "用户 UID" },
  hint: {
    en_US: "Required Bilibili user UID. Keep long IDs as strings.",
    zh_Hans: "必填 Bilibili 用户 UID。长 ID 按字符串保留。",
  },
  llmDescription: {
    en_US:
      "Required Bilibili user UID. Treat it as a string and never convert it to a JavaScript number.",
    zh_Hans:
      "必填 Bilibili 用户 UID。按字符串处理，不要转成 JavaScript number。",
  },
  placeholder: { en_US: "178360345", zh_Hans: "178360345" },
})

export async function invokeBilibiliGet(
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
