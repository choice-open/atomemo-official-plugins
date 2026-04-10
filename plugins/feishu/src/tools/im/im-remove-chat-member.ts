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
  parseImRemoveChatMemberBody,
  parseImRemoveChatMemberQuery,
} from "./zod/im-remove-chat-member.zod"

import im_remove_chat_memberSkill from "./im-remove-chat-member-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "im_remove_chat_member",
  legacy_id: "f036",
  module: "im",
  name: "移出群成员",
  method: "DELETE",
  path: "/open-apis/im/v1/chats/:chat_id/members",
}

export const feishuImRemoveChatMemberTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: `[${fn.module}] ${fn.name}`,
    zh_Hans: `[${fn.module}] ${fn.name}`,
  },
  description: {
    en_US: `${fn.method} ${fn.path} (${fn.id}, legacy: ${fn.legacy_id})`,
    zh_Hans: `${fn.method} ${fn.path}（${fn.id}，兼容: ${fn.legacy_id}）`,
  },
  skill: im_remove_chat_memberSkill,
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
      name: "chat_id",
      type: "string",
      required: true,
      display_name: t("CHAT_ID"),
      ui: {
        component: "input",
        hint: t("CHAT_ID_HINT"),
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"chat_id">,
    {
      name: "member_id_type",
      type: "string",
      required: false,
      display_name: {
        en_US: "member_id_type",
        zh_Hans: "member_id_type",
      },
      ui: {
        component: "input",
        hint: {
          en_US:
            "Query parameter: member ID type (open_id/user_id/union_id/app_id)",
          zh_Hans: "查询参数：成员ID类型 (open_id/user_id/union_id/app_id)",
        },
        placeholder: {
          en_US: "open_id",
          zh_Hans: "open_id",
        },
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"member_id_type">,
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
      chat_id: readRequiredStringParam(p, "chat_id"),
    }
    const queryRaw = parseOptionalJsonObject(
      p.query_params_json,
      "query_params_json",
    )
    const bodyRaw = parseOptionalJsonObject(p.body_json, "body_json")
    const query = parseImRemoveChatMemberQuery(queryRaw)
    const body = parseImRemoveChatMemberBody(bodyRaw)
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams: query,
      body,
    })
  },
}
