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
import { parseApprovalGetInstanceQuery } from "./approval.zod"
import approval_get_instanceSkill from "./approval-get-instance-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "approval_get_instance",
  module: "approval",
  name: "获取单个审批实例详情",
  method: "GET",
  path: "/open-apis/approval/v4/instances/:instance_id",
}

export const feishuApprovalGetInstanceTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Get approval instance",
    zh_Hans: "获取单个审批实例详情",
  },
  description: {
    en_US: "Get details of a single approval instance.",
    zh_Hans: "获取单个审批实例的详细信息。",
  },
  skill: approval_get_instanceSkill,
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
      name: "instance_id",
      type: "string",
      required: true,
      display_name: { en_US: "Instance ID", zh_Hans: "审批实例 ID" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"instance_id">,
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
    const queryParams = parseApprovalGetInstanceQuery(
      parseOptionalJsonObject(p.query_params_json, "query_params_json"),
    )
    const body = {}
    const pathParams = {
      instance_id: readRequiredStringParam(p, "instance_id"),
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
