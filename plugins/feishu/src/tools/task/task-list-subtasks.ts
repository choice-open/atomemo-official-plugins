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
  parseTaskListSubtasksBody,
  parseTaskListSubtasksQuery,
} from "./zod/task-list-subtasks.zod"

import task_list_subtasksSkill from "./task-list-subtasks-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "task_list_subtasks",
  legacy_id: "f070",
  module: "task",
  name: "获取子任务列表",
  method: "GET",
  path: "/open-apis/task/v2/tasks/:task_guid/subtasks",
}

export const feishuTaskListSubtasksTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: `[${fn.module}] ${fn.name}`,
    zh_Hans: `[${fn.module}] ${fn.name}`,
  },
  description: {
    en_US: `${fn.method} ${fn.path} (${fn.id}, legacy: ${fn.legacy_id})`,
    zh_Hans: `${fn.method} ${fn.path}（${fn.id}，兼容: ${fn.legacy_id}）`,
  },
  skill: task_list_subtasksSkill,
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
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const pathParams = {
      task_guid: readRequiredStringParam(p, "task_guid"),
    }
    const queryRaw = parseOptionalJsonObject(
      p.query_params_json,
      "query_params_json",
    )
    const query = parseTaskListSubtasksQuery(queryRaw)
    const body = parseTaskListSubtasksBody({})
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams: query,
      body,
    })
  },
}
