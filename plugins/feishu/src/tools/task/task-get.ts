import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { invokeFeishuOpenApi, readRequiredStringParam } from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import { parseTaskGetQuery } from "./task.zod"
import task_getSkill from "./task-get-skill.md" with { type: "text" }

const fn: FeishuApiFunction = {
  id: "task_get",
  module: "task",
  name: "获取任务详情",
  method: "GET",
  path: "/open-apis/task/v2/tasks/:task_guid",
}

export const feishuTaskGetTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Get task",
    zh_Hans: "获取任务详情",
  },
  description: {
    en_US: "This API is used to get task details.",
    zh_Hans: "本接口用于获取任务详情。",
  },
  skill: task_getSkill,
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
      name: "user_id_type",
      type: "string",
      required: false,
      display_name: { en_US: "User ID Type", zh_Hans: "用户 ID 类型" },
      ui: {
        component: "input",
        placeholder: { en_US: "open_id | union_id | user_id", zh_Hans: "open_id | union_id | user_id" },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"user_id_type">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const userIdType =
      typeof p.user_id_type === "string" && p.user_id_type.trim() !== ""
        ? p.user_id_type.trim()
        : undefined
    const queryParams = parseTaskGetQuery({
      ...(userIdType ? { user_id_type: userIdType } : {}),
    })
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
