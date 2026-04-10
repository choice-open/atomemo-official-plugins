import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import {
  invokeFeishuOpenApi,
  parseOptionalJsonObject,
  readRequiredStringParam,
} from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import {
  parseContactCreateUserBody,
  parseContactCreateUserQuery,
} from "./contact-create-user.zod"

import contact_create_userSkill from "./contact-create-user-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "contact_create_user",
  legacy_id: "f001",
  module: "contact",
  name: "创建员工",
  method: "POST",
  path: "/open-apis/contact/v3/users",
}

export const feishuContactCreateUserTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: `[${fn.module}] ${fn.name}`,
    zh_Hans: `[${fn.module}] ${fn.name}`,
  },
  description: {
    en_US: `${fn.method} ${fn.path} (${fn.id}, legacy: ${fn.legacy_id})`,
    zh_Hans: `${fn.method} ${fn.path}（${fn.id}，兼容: ${fn.legacy_id}）`,
  },
  skill: contact_create_userSkill,
  icon: "🪶",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "feishu-app-credential",
      display_name: t("CREDENTIAL"),
      ui: { component: "credential-select" },
    } satisfies Property<"credential_id">,
    {
      name: "query_params_json",
      type: "string",
      required: false,
      display_name: t("QUERY_PARAMS"),
      ui: {
        component: "input",
        hint: t("QUERY_PARAMS_HINT"),
        placeholder: { en_US: '{"page_size":20}', zh_Hans: '{"page_size":20}' },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"query_params_json">,
    {
      name: "body_json",
      type: "string",
      required: true,
      display_name: t("BODY"),
      ui: {
        component: "input",
        hint: {
          en_US:
            "JSON object string per Feishu create-user API (name, mobile, department_ids, employee_type required)",
          zh_Hans:
            "创建用户请求体 JSON 对象字符串（必填字段见飞书文档：name、mobile、department_ids、employee_type）",
        },
        placeholder: {
          en_US:
            '{"name":"张三","mobile":"13011111111","department_ids":["od-xxx"],"employee_type":1}',
          zh_Hans:
            '{"name":"张三","mobile":"13011111111","department_ids":["od-xxx"],"employee_type":1}',
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const pathParams = {}
    const queryRaw = parseOptionalJsonObject(
      p.query_params_json,
      "query_params_json",
    )
    const bodyRaw = parseOptionalJsonObject(
      readRequiredStringParam(p, "body_json"),
      "body_json",
    )
    const queryParams = parseContactCreateUserQuery(queryRaw) as Record<
      string,
      unknown
    >
    const body = parseContactCreateUserBody(bodyRaw) as Record<string, unknown>
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams,
      body,
    })
  },
}
