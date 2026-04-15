import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  invokeFeishuOpenApi,
  readRequiredStringParam,
} from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import { parseTaskDeleteQuery } from "./task.zod"
import task_deleteSkill from "./task-delete-skill.md" with { type: "text" }

const fn: FeishuApiFunction = {
  id: "task_delete",
  module: "task",
  name: "删除任务",
  method: "DELETE",
  path: "/open-apis/task/v2/tasks/:task_guid",
}

export const feishuTaskDeleteTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Delete task",
    zh_Hans: "删除任务",
  },
  description: {
    en_US: "This API is used to delete a task.",
    zh_Hans: "本接口用于删除任务。",
  },
  skill: task_deleteSkill,
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
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseTaskDeleteQuery({})
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
