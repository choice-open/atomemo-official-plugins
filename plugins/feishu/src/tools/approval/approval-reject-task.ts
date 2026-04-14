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
import { parseApprovalRejectTaskQuery } from "./approval.zod"
import approval_reject_taskSkill from "./approval-reject-task-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "approval_reject_task",
  module: "approval",
  name: "拒绝审批任务",
  method: "POST",
  path: "/open-apis/approval/v4/tasks/reject",
}

export const feishuApprovalRejectTaskTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Reject task",
    zh_Hans: "拒绝审批任务",
  },
  description: {
    en_US: "Reject a single approval task.",
    zh_Hans: "对单个审批任务执行拒绝操作。",
  },
  skill: approval_reject_taskSkill,
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
    const queryParams = parseApprovalRejectTaskQuery(
      parseOptionalJsonObject(p.query_params_json, "query_params_json"),
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
