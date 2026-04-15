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
import { parseTasklistAddMembersQuery } from "./task.zod"
import tasklist_add_membersSkill from "./tasklist-add-members-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "tasklist_add_members",
  module: "task",
  name: "添加清单成员",
  method: "POST",
  path: "/open-apis/task/v2/tasklists/:tasklist_guid/add_members",
}

export const feishuTasklistAddMembersTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Add tasklist members",
    zh_Hans: "添加清单成员",
  },
  description: {
    en_US: "This API is used to add members to a tasklist.",
    zh_Hans: "本接口用于向清单添加成员。",
  },
  skill: tasklist_add_membersSkill,
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
    const queryParams = parseTasklistAddMembersQuery({
      ...(userIdType ? { user_id_type: userIdType } : {}),
    })
    const body = parseOptionalJsonObject(
      readRequiredStringParam(p, "body_json"),
      "body_json",
    )
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
