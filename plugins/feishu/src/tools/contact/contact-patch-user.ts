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
  parseContactPatchUserBody,
  parseContactPatchUserQuery,
} from "./contact-patch-user.zod"

import contact_patch_userSkill from "./contact-patch-user-skill.md" with {
  type: "text",
}

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
  skill: contact_patch_userSkill,
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
