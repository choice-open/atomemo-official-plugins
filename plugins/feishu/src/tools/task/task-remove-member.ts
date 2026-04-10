import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  invokeFeishuOpenApi,
  parseOptionalJsonObject,
  readRequiredStringParam,
} from "../feishu/request"
import { t } from "../i18n/i18n-node"
import type { FeishuApiFunction } from "../feishu-api-functions"
import {
  parseTaskRemoveMemberBody,
  parseTaskRemoveMemberQuery,
} from "./zod/task-actions.zod"

import task_remove_memberSkill from "./task-remove-member-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "task_remove_member",
  legacy_id: "f068",
  module: "task",
  name: "移除任务成员",
  method: "DELETE",
  path: "/open-apis/task/v2/tasks/:task_guid/members/:member_id",
}

export const feishuTaskRemoveMemberTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: `[${fn.module}] ${fn.name}`,
    zh_Hans: `[${fn.module}] ${fn.name}`,
  },
  description: {
    en_US: `${fn.method} ${fn.path} (${fn.id}, legacy: ${fn.legacy_id})`,
    zh_Hans: `${fn.method} ${fn.path}（${fn.id}，兼容: ${fn.legacy_id}）`,
  },
  skill: task_remove_memberSkill,
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
      name: "task_guid",
      type: "string",
      required: true,
      display_name: t("TASK_GUID"),
      ui: {
        component: "input",
        hint: t("TASK_GUID_HINT"),
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"task_guid">,
    {
      name: "member_id",
      type: "string",
      required: true,
      display_name: t("MEMBER_ID"),
      ui: {
        component: "input",
        hint: t("MEMBER_ID_HINT"),
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"member_id">,
    {
      name: "query_params_json",
      type: "string",
      required: false,
      display_name: t("QUERY_PARAMS"),
      ui: {
        component: "input",
        hint: t("QUERY_PARAMS_HINT"),
        placeholder: {
          en_US: '{"page_size":20}',
          zh_Hans: '{"page_size":20}',
        },
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
        placeholder: {
          en_US: '{"key":"value"}',
          zh_Hans: '{"key":"value"}',
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const pathParams = {
      task_guid: readRequiredStringParam(p, "task_guid"),
      member_id: readRequiredStringParam(p, "member_id"),
    }
    const queryRaw = parseOptionalJsonObject(
      p.query_params_json,
      "query_params_json",
    )
    const query = parseTaskRemoveMemberQuery(queryRaw)
    const body = parseTaskRemoveMemberBody({})
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams: query,
      body,
    })
  },
}
