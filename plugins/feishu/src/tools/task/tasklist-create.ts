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
import { parseTasklistCreateQuery } from "./task.zod"
import tasklist_createSkill from "./tasklist-create-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "tasklist_create",
  module: "task",
  name: "创建清单",
  method: "POST",
  path: "/open-apis/task/v2/tasklists",
}

export const feishuTasklistCreateTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Create tasklist",
    zh_Hans: "创建清单",
  },
  description: {
    en_US: "This API is used to create a tasklist.",
    zh_Hans: "本接口用于创建清单。",
  },
  skill: tasklist_createSkill,
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
    const queryParams = parseTasklistCreateQuery({
      ...(userIdType ? { user_id_type: userIdType } : {}),
    })
    const body = parseOptionalJsonObject(
      readRequiredStringParam(p, "body_json"),
      "body_json",
    )
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
