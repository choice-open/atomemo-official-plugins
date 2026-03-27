import type {
  JsonValue,
  PropertyCredentialId,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { getSkill } from "../skills"
import { getArgs, getJson, getUploadPostApiKey } from "./_shared/upload-post-client"

const credentialParameter: PropertyCredentialId<"credentialId"> = {
  name: "credentialId",
  type: "credential_id",
  credential_name: "upload-post-api-key",
  display_name: {
    en_US: "Credential",
    zh_Hans: "凭证",
  },
  required: true,
  ui: {
    component: "credential-select",
  },
}

export const getUploadStatusTool = {
  name: "get_upload_status",
  display_name: {
    en_US: "Get Upload Status",
    zh_Hans: "查询上传状态",
  },
  description: {
    en_US: "Query Upload-Post async task status by request_id",
    zh_Hans: "根据 request_id 查询 Upload-Post 异步任务状态",
  },
  icon: "📊",
  skill: getSkill("get-upload-status"),
  parameters: [
    credentialParameter,
    {
      name: "request_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Request ID",
        zh_Hans: "请求 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The request_id returned by upload_media",
          zh_Hans: "upload_media 返回的 request_id",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  invoke: async ({ args }): Promise<JsonValue> => {
    const apiKey = getUploadPostApiKey(args)
    if (!apiKey) {
      throw new Error(
        "Missing Upload-Post API key in selected credential. Please pick a valid credential.",
      )
    }

    const { parameters } = getArgs(args)
    const requestId =
      typeof parameters.request_id === "string"
        ? parameters.request_id.trim()
        : ""

    if (!requestId) {
      throw new Error("Parameter `request_id` is required.")
    }

    const response = await getJson<Record<string, unknown>>(
      `/uploadposts/status?request_id=${encodeURIComponent(requestId)}`,
      apiKey,
    )

    if (!response.ok) {
      throw new Error(response.reason)
    }

    return response.data as JsonValue
  },
} satisfies ToolDefinition
