import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  invokeFeishuOpenApi,
  parseOptionalJsonObject,
  readRequiredStringParam,
} from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import { parseTasklistListTasksQuery } from "./task.zod"
import tasklist_list_tasksSkill from "./tasklist-list-tasks-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "tasklist_list_tasks",
  module: "task",
  name: "获取清单任务列表",
  method: "GET",
  path: "/open-apis/task/v2/tasklists/:tasklist_guid/tasks",
}

export const feishuTasklistListTasksTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "List tasklist tasks",
    zh_Hans: "获取清单任务列表",
  },
  description: {
    en_US: "This API is used to list tasks in a tasklist.",
    zh_Hans: "本接口用于获取清单任务列表。",
  },
  skill: tasklist_list_tasksSkill,
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
      name: "tasklist_guid",
      type: "string",
      required: true,
      display_name: { en_US: "Tasklist GUID", zh_Hans: "清单 GUID" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"tasklist_guid">,
    {
      name: "query_params_json",
      type: "string",
      required: false,
      display_name: t("QUERY_PARAMS"),
      ui: {
        component: "code-editor",
        hint: t("QUERY_PARAMS_HINT"),
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"query_params_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseTasklistListTasksQuery(
      parseOptionalJsonObject(p.query_params_json, "query_params_json"),
    )
    const body = {}
    const pathParams = {
      tasklist_guid: readRequiredStringParam(p, "tasklist_guid"),
    }
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams,
      body,
    })
  },
}
