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

export function toutiaoStringParameter<Name extends string>(options: {
  name: Name
  required?: boolean
  displayName: { en_US: string; zh_Hans: string }
  hint: { en_US: string; zh_Hans: string }
  llmDescription: { en_US: string; zh_Hans: string }
  placeholder?: { en_US: string; zh_Hans: string }
}): Property<Name> {
  return {
    name: options.name,
    type: "string",
    required: options.required ?? false,
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

export function readOptionalStringParam(
  params: Record<string, unknown>,
  name: string,
): string | undefined {
  const value = params[name]
  return typeof value === "string" ? value : undefined
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

export const groupIdParameter = (kind: "article" | "video" | "post") =>
  toutiaoStringParameter({
    name: "group_id",
    required: true,
    displayName: { en_US: "Group ID", zh_Hans: "作品 group_id" },
    hint: {
      en_US:
        kind === "article"
          ? "Required article group_id, e.g. from /article/{group_id}/ URL. Keep it as a string."
          : kind === "video"
            ? "Required video group_id, e.g. from /video/{group_id}/ URL. Keep it as a string."
            : "Required Toutiao post group_id. Keep long IDs as strings.",
      zh_Hans:
        kind === "article"
          ? "必填文章 group_id，可从 /article/{group_id}/ 链接中取得。按字符串保留。"
          : kind === "video"
            ? "必填视频 group_id，可从 /video/{group_id}/ 链接中取得。按字符串保留。"
            : "必填今日头条作品 group_id。长 ID 按字符串保留。",
    },
    llmDescription: {
      en_US:
        "Required Toutiao group_id. Treat it as a string and never convert long numeric IDs to JavaScript numbers.",
      zh_Hans:
        "必填今日头条 group_id。按字符串处理，不要把长数字 ID 转成 JavaScript number。",
    },
    placeholder: {
      en_US: kind === "video" ? "7431543350882206242" : "7450114952884503059",
      zh_Hans: kind === "video" ? "7431543350882206242" : "7450114952884503059",
    },
  })

export async function invokeToutiaoGet(
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
