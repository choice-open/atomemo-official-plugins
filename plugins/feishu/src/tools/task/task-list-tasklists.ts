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
import { parseTaskListTasklistsQuery } from "./task.zod"
import task_list_tasklistsSkill from "./task-list-tasklists-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "task_list_tasklists",
  module: "task",
  name: "列取任务所在清单",
  method: "GET",
  path: "/open-apis/task/v2/tasks/:task_guid/tasklists",
}

export const feishuTaskListTasklistsTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "List task tasklists",
    zh_Hans: "列取任务所在清单",
  },
  description: {
    en_US: "This API is used to list tasklists of a task.",
    zh_Hans: "本接口用于列取任务所在清单。",
  },
  skill: task_list_tasklistsSkill,
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
      display_name: { en_US: "Task GUID", zh_Hans: "任务 GUID" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"task_guid">,
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
    const queryParams = parseTaskListTasklistsQuery(
      parseOptionalJsonObject(p.query_params_json, "query_params_json"),
    )
    const body = {}
    const pathParams = {
      task_guid: readRequiredStringParam(p, "task_guid"),
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
