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
import { parseTaskListQuery } from "./task.zod"
import task_listSkill from "./task-list-skill.md" with { type: "text" }

const fn: FeishuApiFunction = {
  id: "task_list",
  module: "task",
  name: "列取任务列表",
  method: "GET",
  path: "/open-apis/task/v2/tasks",
}

export const feishuTaskListTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "List tasks",
    zh_Hans: "列取任务列表",
  },
  description: {
    en_US: "This API is used to list tasks.",
    zh_Hans: "本接口用于列取任务列表。",
  },
  skill: task_listSkill,
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
    const queryParams = parseTaskListQuery(
      parseOptionalJsonObject(p.query_params_json, "query_params_json"),
    )
    const body = {}
    const pathParams = {}
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams,
      body,
    })
  },
}
