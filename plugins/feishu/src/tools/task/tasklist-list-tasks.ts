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
      name: "created_from",
      type: "string",
      required: false,
      display_name: { en_US: "Created From", zh_Hans: "创建时间起点(ms)" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"created_from">,
    {
      name: "created_to",
      type: "string",
      required: false,
      display_name: { en_US: "Created To", zh_Hans: "创建时间终点(ms)" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"created_to">,
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
    const queryParams = parseTasklistListTasksQuery({
      ...(optionalInt("page_size") !== undefined
        ? { page_size: optionalInt("page_size") }
        : {}),
      ...(optionalString("page_token")
        ? { page_token: optionalString("page_token") }
        : {}),
      ...(optionalBoolean("completed") !== undefined
        ? { completed: optionalBoolean("completed") }
        : {}),
      ...(optionalString("created_from")
        ? { created_from: optionalString("created_from") }
        : {}),
      ...(optionalString("created_to")
        ? { created_to: optionalString("created_to") }
        : {}),
      ...(optionalString("user_id_type")
        ? { user_id_type: optionalString("user_id_type") }
        : {}),
    })
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
