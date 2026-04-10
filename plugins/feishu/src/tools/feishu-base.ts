import type {
  PropertyCredentialId,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { AppType, Client, Domain } from "@larksuiteoapi/node-sdk"

export type LarkClientLike = Client

export function createFeishuClient(
  appId: string,
  appSecret: string,
): LarkClientLike {
  return new Client({
    appId,
    appSecret,
    appType: AppType.SelfBuild,
    domain: Domain.Feishu,
  }) as unknown as LarkClientLike
}

export const credentialParameter: PropertyCredentialId<"credentialId"> = {
  name: "credentialId",
  type: "credential_id",
  credential_name: "feishu-app-credential",
  display_name: {
    en_US: "Credential",
    zh_Hans: "凭证",
  },
  required: true,
  ui: {
    component: "credential-select",
  },
}

export function getObject(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {}
  }
  return input as Record<string, unknown>
}

export function parseJsonObjectString(
  input: unknown,
  fieldName: string,
): Record<string, unknown> {
  const text = String(input ?? "").trim()
  if (!text) {
    return {}
  }
  try {
    const parsed = JSON.parse(text)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error(`Parameter \`${fieldName}\` must be a JSON object string`)
    }
    return parsed as Record<string, unknown>
  } catch (error) {
    throw new Error(
      `Invalid JSON for parameter \`${fieldName}\`: ${(error as Error).message}`,
    )
  }
}

export function hasKeys(input: Record<string, unknown>): boolean {
  return Object.keys(input).length > 0
}

export function parseJsonValueString(
  input: string,
  fieldName: string,
): unknown {
  try {
    return JSON.parse(input)
  } catch (error) {
    throw new Error(
      `Invalid JSON for field \`${fieldName}\`: ${(error as Error).message}`,
    )
  }
}

export function parseTypedValue(
  input: string,
  valueType: "string" | "json" | "number" | "boolean",
  fieldName: string,
): unknown {
  if (valueType === "json") {
    return parseJsonValueString(input, fieldName)
  }
  if (valueType === "number") {
    const parsed = Number(input)
    if (Number.isNaN(parsed)) {
      throw new Error(`Invalid number for field \`${fieldName}\``)
    }
    return parsed
  }
  if (valueType === "boolean") {
    const lower = input.toLowerCase()
    if (lower === "true") {
      return true
    }
    if (lower === "false") {
      return false
    }
    throw new Error(
      `Invalid boolean for field \`${fieldName}\`, use true/false`,
    )
  }
  return input
}

export function expectNestedString(
  payload: Record<string, unknown>,
  section: "params" | "path" | "data",
  key: string,
): void {
  const part = getObject(payload[section])
  const value = String(part[key] ?? "").trim()
  if (!value) {
    throw new Error(
      `VALIDATION_ERROR: Missing required field: ${section}.${key}`,
    )
  }
}

export function expectNestedArray(
  payload: Record<string, unknown>,
  section: "params" | "path" | "data",
  key: string,
): void {
  const part = getObject(payload[section])
  const value = part[key]
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(
      `VALIDATION_ERROR: Missing required field: ${section}.${key}`,
    )
  }
}

export function expectAtLeastOneNestedField(
  payload: Record<string, unknown>,
  section: "params" | "path" | "data",
  keys: string[],
): void {
  const part = getObject(payload[section])
  for (const key of keys) {
    const value = part[key]
    if (typeof value === "string" && value.trim()) {
      return
    }
    if (Array.isArray(value) && value.length > 0) {
      return
    }
    if (value && typeof value === "object") {
      return
    }
  }
  throw new Error(
    `VALIDATION_ERROR: Missing required field: ${section}.${keys.join(" or ")}`,
  )
}

export type UiField = {
  name: string
  displayNameEn: string
  displayNameZh: string
  target: "params" | "path" | "data"
  key: string
  valueType?: "string" | "json" | "number" | "boolean"
  required?: boolean
  placeholder?: string
}

export type CreateSdkToolInput = {
  name: string
  skill?: string
  displayNameZh: string
  displayNameEn: string
  descriptionZh: string
  descriptionEn: string
  uiFields?: UiField[]
  validatePayload?: (payload: Record<string, unknown>) => void
  invokeSdk: (
    client: LarkClientLike,
    payload: Record<string, unknown>,
  ) => Promise<unknown>
}

export type ToolFactoryOptions = {
  clientFactory?: (appId: string, appSecret: string) => LarkClientLike
}

export function createFeishuSdkTool(
  input: CreateSdkToolInput,
  options: ToolFactoryOptions = {},
): ToolDefinition {
  const factory = options.clientFactory ?? createFeishuClient
  const skill =
    input.skill ?? input.name.replace(/^feishu_/, "").replaceAll("_", ".")
  const dynamicFields = (input.uiFields ?? []).map((field) => ({
    name: field.name,
    type: "string" as const,
    required: field.required ?? false,
    display_name: {
      en_US: field.displayNameEn,
      zh_Hans: field.displayNameZh,
    },
    ui: {
      component: "input" as const,
      width: "full" as const,
      support_expression: true,
      placeholder: {
        en_US: field.placeholder ?? "",
        zh_Hans: field.placeholder ?? "",
      },
    },
  }))

  return {
    name: input.name,
    skill,
    display_name: {
      en_US: input.displayNameEn,
      zh_Hans: input.displayNameZh,
    },
    description: {
      en_US: input.descriptionEn,
      zh_Hans: input.descriptionZh,
    },
    icon: "🧰",
    parameters: [
      credentialParameter,
      ...dynamicFields,
      {
        name: "payload_json",
        type: "string",
        required: false,
        display_name: {
          en_US: "SDK Payload JSON",
          zh_Hans: "SDK 请求参数 JSON",
        },
        ui: {
          component: "textarea",
          width: "full",
          support_expression: true,
          hint: {
            en_US:
              "Optional full SDK payload. If set, it overrides params_json/path_json/data_json.",
            zh_Hans:
              "可选完整 SDK payload。填写后将覆盖 params_json/path_json/data_json。",
          },
          placeholder: {
            en_US: '{"params":{},"path":{},"data":{}}',
            zh_Hans: '{"params":{},"path":{},"data":{}}',
          },
        },
      },
      {
        name: "params_json",
        type: "string",
        required: false,
        display_name: {
          en_US: "params JSON",
          zh_Hans: "params JSON",
        },
        ui: {
          component: "textarea",
          width: "full",
          support_expression: true,
          placeholder: {
            en_US: '{"user_id_type":"open_id","page_size":50}',
            zh_Hans: '{"user_id_type":"open_id","page_size":50}',
          },
        },
      },
      {
        name: "path_json",
        type: "string",
        required: false,
        display_name: {
          en_US: "path JSON",
          zh_Hans: "path JSON",
        },
        ui: {
          component: "textarea",
          width: "full",
          support_expression: true,
          placeholder: {
            en_US:
              '{"user_id":"ou_xxx","calendar_id":"cal_xxx","event_id":"evt_xxx"}',
            zh_Hans:
              '{"user_id":"ou_xxx","calendar_id":"cal_xxx","event_id":"evt_xxx"}',
          },
        },
      },
      {
        name: "data_json",
        type: "string",
        required: false,
        display_name: {
          en_US: "data JSON",
          zh_Hans: "data JSON",
        },
        ui: {
          component: "textarea",
          width: "full",
          support_expression: true,
          placeholder: {
            en_US: '{"name":"demo","summary":"meeting","receive_id":"ou_xxx"}',
            zh_Hans:
              '{"name":"demo","summary":"meeting","receive_id":"ou_xxx"}',
          },
        },
      },
    ],
    async invoke({ args }) {
      const parameters = getObject(args.parameters)
      const credentials = getObject(args.credentials)

      const credentialId = String(parameters.credentialId ?? "").trim()
      if (!credentialId) {
        throw new Error("Missing credentialId")
      }

      const credential = getObject(credentials[credentialId])
      const appId = String(credential.app_id ?? "").trim()
      const appSecret = String(credential.app_secret ?? "").trim()
      if (!appId || !appSecret) {
        throw new Error(
          "Selected credential is invalid: missing app_id or app_secret",
        )
      }

      const payloadFromFull = parseJsonObjectString(
        parameters.payload_json,
        "payload_json",
      )
      const paramsObject = parseJsonObjectString(
        parameters.params_json,
        "params_json",
      )
      const pathObject = parseJsonObjectString(
        parameters.path_json,
        "path_json",
      )
      const dataObject = parseJsonObjectString(
        parameters.data_json,
        "data_json",
      )
      for (const field of input.uiFields ?? []) {
        const value = String(parameters[field.name] ?? "").trim()
        if ((field.required ?? false) && !value) {
          throw new Error(`Parameter \`${field.name}\` is required`)
        }
        if (!value) {
          continue
        }
        const parsedValue = parseTypedValue(
          value,
          field.valueType ?? "string",
          field.name,
        )
        if (field.target === "params") {
          paramsObject[field.key] = parsedValue
        } else if (field.target === "path") {
          pathObject[field.key] = parsedValue
        } else {
          dataObject[field.key] = parsedValue
        }
      }
      const payload = hasKeys(payloadFromFull)
        ? payloadFromFull
        : {
            ...(hasKeys(paramsObject) ? { params: paramsObject } : {}),
            ...(hasKeys(pathObject) ? { path: pathObject } : {}),
            ...(hasKeys(dataObject) ? { data: dataObject } : {}),
          }
      input.validatePayload?.(payload)
      const client = factory(appId, appSecret)
      const response = await input.invokeSdk(client, payload)

      return {
        message: `Feishu API invoked successfully: ${input.name}`,
        tool: input.name,
        payload_raw: JSON.stringify(payload),
        response_raw: JSON.stringify(response),
      }
    },
  } satisfies ToolDefinition
}
