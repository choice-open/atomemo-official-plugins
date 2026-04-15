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
import { parseApprovalListInstancesQuery } from "./approval.zod"
import approval_list_instancesSkill from "./approval-list-instances-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "approval_batch_get_instance_ids",
  module: "approval",
  name: "批量获取审批实例 ID",
  method: "GET",
  path: "/open-apis/approval/v4/instances",
}

export const feishuApprovalListInstancesTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Batch get approval instance IDs",
    zh_Hans: "批量获取审批实例 ID",
  },
  description: {
    en_US: "Batch get approval instance IDs with filters.",
    zh_Hans: "按筛选条件批量获取审批实例 ID 列表。",
  },
  skill: approval_list_instancesSkill,
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
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseApprovalListInstancesQuery(
      parseOptionalJsonObject(p.query_params_json, "query_params_json"),
    )
    const body = {}
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: {},
      queryParams,
      body,
    })
  },
}
