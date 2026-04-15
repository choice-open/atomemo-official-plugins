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
import { parseTaskRemoveMembersQuery } from "./task.zod"
import task_remove_membersSkill from "./task-remove-members-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "task_remove_members",
  module: "task",
  name: "移除任务成员",
  method: "POST",
  path: "/open-apis/task/v2/tasks/:task_guid/remove_members",
}

export const feishuTaskRemoveMembersTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Remove task members",
    zh_Hans: "移除任务成员",
  },
  description: {
    en_US: "This API is used to remove members from a task.",
    zh_Hans: "本接口用于从任务中移除成员。",
  },
  skill: task_remove_membersSkill,
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
    {
      name: "body_json",
      type: "string",
      required: true,
      display_name: t("BODY"),
      ui: { component: "code-editor", width: "full", support_expression: true },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const userIdType =
      typeof p.user_id_type === "string" && p.user_id_type.trim() !== ""
        ? p.user_id_type.trim()
        : undefined
    const queryParams = parseTaskRemoveMembersQuery({
      ...(userIdType ? { user_id_type: userIdType } : {}),
    })
    const body = parseOptionalJsonObject(
      readRequiredStringParam(p, "body_json"),
      "body_json",
    )
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
