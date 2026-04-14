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
import { parseApprovalCreateInstanceQuery } from "./approval.zod"
import approval_create_instanceSkill from "./approval-create-instance-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "approval_create_instance",
  module: "approval",
  name: "创建审批实例",
  method: "POST",
  path: "/open-apis/approval/v4/instances",
}

export const feishuApprovalCreateInstanceTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Create approval instance",
    zh_Hans: "创建审批实例",
  },
  description: {
    en_US: "Create an approval instance by approval definition code.",
    zh_Hans: "使用审批定义 Code 创建原生审批实例。",
  },
  skill: approval_create_instanceSkill,
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
    const queryParams = parseApprovalCreateInstanceQuery(
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
