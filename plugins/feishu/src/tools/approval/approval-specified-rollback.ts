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
    const queryParams = parseApprovalSpecifiedRollbackQuery(
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
