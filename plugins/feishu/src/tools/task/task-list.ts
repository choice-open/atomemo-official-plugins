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
      name: "page_size",
      type: "string",
      required: false,
      display_name: { en_US: "Page Size", zh_Hans: "分页大小" },
      ui: {
        component: "input",
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"page_size">,
    {
      name: "page_token",
      type: "string",
      required: false,
      display_name: { en_US: "Page Token", zh_Hans: "分页游标" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"page_token">,
    {
      name: "completed",
      type: "string",
      required: false,
      display_name: { en_US: "Completed", zh_Hans: "是否完成过滤" },
      ui: {
        component: "input",
        placeholder: { en_US: "true | false", zh_Hans: "true | false" },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"completed">,
    {
      name: "type",
      type: "string",
      required: false,
      display_name: { en_US: "Type", zh_Hans: "列取类型" },
      ui: {
        component: "input",
        placeholder: { en_US: "my_tasks", zh_Hans: "my_tasks" },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"type">,
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
    const optionalString = (key: string): string | undefined => {
      const raw = p[key]
      if (typeof raw !== "string") return undefined
      const trimmed = raw.trim()
      return trimmed === "" ? undefined : trimmed
    }
    const optionalInt = (key: string): number | undefined => {
      const raw = optionalString(key)
      if (!raw) return undefined
      const n = Number(raw)
      return Number.isInteger(n) ? n : undefined
    }
    const optionalBoolean = (key: string): boolean | undefined => {
      const raw = optionalString(key)
      if (!raw) return undefined
      if (raw === "true") return true
      if (raw === "false") return false
      return undefined
    }
    const queryParams = parseTaskListQuery({
      ...(optionalInt("page_size") !== undefined
        ? { page_size: optionalInt("page_size") }
        : {}),
      ...(optionalString("page_token")
        ? { page_token: optionalString("page_token") }
        : {}),
      ...(optionalBoolean("completed") !== undefined
        ? { completed: optionalBoolean("completed") }
        : {}),
      ...(optionalString("type") ? { type: optionalString("type") } : {}),
      ...(optionalString("user_id_type")
        ? { user_id_type: optionalString("user_id_type") }
        : {}),
    })
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
