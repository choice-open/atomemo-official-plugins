import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  invokeFeishuOpenApi,
  parseOptionalJsonObject,
  readRequiredStringParam,
} from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import {
  parseContactPatchUserBody,
  parseContactPatchUserQuery,
} from "./contact-patch-user.zod"

const fn: FeishuApiFunction = {
  id: "contact_patch_user",
  legacy_id: "f002",
  module: "contact",
  name: "更新员工信息",
  method: "PATCH",
  path: "/open-apis/contact/v3/users/{user_id}",
}

export const feishuContactPatchUserTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: `[${fn.module}] ${fn.name}`,
    zh_Hans: `[${fn.module}] ${fn.name}`,
  },
  description: {
    en_US: `${fn.method} ${fn.path} (${fn.id}, legacy: ${fn.legacy_id})`,
    zh_Hans: `${fn.method} ${fn.path}（${fn.id}，兼容: ${fn.legacy_id}）`,
  },
  icon: "🪶",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "feishu-app-credential",
      display_name: { en_US: "Credential", zh_Hans: "凭证" },
      ui: { component: "credential-select" },
    } satisfies Property<"credential_id">,
    {
      name: "user_id",
      type: "string",
      required: true,
      display_name: { en_US: "user_id", zh_Hans: "user_id" },
      ui: {
        component: "input",
        hint: {
          en_US: "URL path parameter: user_id",
          zh_Hans: "URL 路径参数：user_id",
        },
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"user_id">,
    {
      name: "query_params_json",
      type: "string",
      required: false,
      display_name: {
        en_US: "Query Params",
        zh_Hans: "查询参数",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "HTTP query object as JSON string (optional)",
          zh_Hans: "HTTP 查询参数，JSON 对象字符串（可选）",
        },
        placeholder: {
          en_US: '{"page_size":20}',
          zh_Hans: '{"page_size":20}',
        },
        width: "full",
      },
    } satisfies Property<"query_params_json">,
    {
      name: "body_json",
      type: "string",
      required: false,
      display_name: {
        en_US: "Body",
        zh_Hans: "请求体",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "HTTP body object as JSON string (optional)",
          zh_Hans: "HTTP 请求体，JSON 对象字符串（可选）",
        },
        placeholder: {
          en_US: '{"key":"value"}',
          zh_Hans: '{"key":"value"}',
        },
        width: "full",
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const pathParams = {
      user_id: readRequiredStringParam(p, "user_id"),
    }
    const queryRaw = parseOptionalJsonObject(
      p.query_params_json,
      "query_params_json",
    )
    const bodyRaw = parseOptionalJsonObject(p.body_json, "body_json")
    const queryParams = parseContactPatchUserQuery(queryRaw) as Record<
      string,
      unknown
    >
    const body = parseContactPatchUserBody(bodyRaw) as Record<string, unknown>
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams,
      body,
    })
  },
}
