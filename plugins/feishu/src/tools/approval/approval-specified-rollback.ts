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
import { parseApprovalSpecifiedRollbackQuery } from "./approval.zod"
import approval_specified_rollbackSkill from "./approval-specified-rollback-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "approval_specified_rollback",
  module: "approval",
  name: "退回审批任务",
  method: "POST",
  path: "/open-apis/approval/v4/instances/specified_rollback",
}

export const feishuApprovalSpecifiedRollbackTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Return task",
    zh_Hans: "退回审批任务",
  },
  description: {
    en_US: "Roll back current task to passed node keys.",
    zh_Hans: "将当前审批任务退回到已通过的一个或多个节点。",
  },
  skill: approval_specified_rollbackSkill,
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
    const queryParams = parseApprovalSpecifiedRollbackQuery(
      {
        ...(userIdType ? { user_id_type: userIdType } : {}),
      },
    )
    const body = parseOptionalJsonObject(
      readRequiredStringParam(p, "body_json"),
      "body_json",
    )
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: {},
      queryParams,
      body,
    })
  },
}
