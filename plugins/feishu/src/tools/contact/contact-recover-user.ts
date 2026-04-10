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
  parseContactActionBody,
  parseContactActionQuery,
} from "./contact-actions.zod"

import contact_recover_userSkill from "./contact-recover-user-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "contact_recover_user",
  legacy_id: "f016",
  module: "contact",
  name: "恢复已删除用户",
  method: "POST",
  path: "/open-apis/contact/v3/users/:user_id/recover",
}

export const feishuContactRecoverUserTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: `[${fn.module}] ${fn.name}`,
    zh_Hans: `[${fn.module}] ${fn.name}`,
  },
  description: {
    en_US: `${fn.method} ${fn.path} (${fn.id}, legacy: ${fn.legacy_id})`,
    zh_Hans: `${fn.method} ${fn.path}（${fn.id}，兼容: ${fn.legacy_id}）`,
  },
  skill: contact_recover_userSkill,
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
      name: "user_id",
      type: "string",
      required: true,
      display_name: t("USER_ID"),
      ui: {
        component: "input",
        hint: t("USER_ID_HINT"),
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"user_id">,
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
      required: false,
      display_name: t("BODY"),
      ui: {
        component: "input",
        hint: t("BODY_HINT"),
        placeholder: { en_US: '{"key":"value"}', zh_Hans: '{"key":"value"}' },
        width: "full",
        support_expression: true,
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
    const query = parseContactActionQuery(queryRaw)
    const body = parseContactActionBody(bodyRaw)
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams: query,
      body,
    })
  },
}
