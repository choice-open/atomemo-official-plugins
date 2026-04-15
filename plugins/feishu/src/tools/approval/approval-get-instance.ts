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
      name: "user_id",
      type: "string",
      required: false,
      display_name: { en_US: "User ID", zh_Hans: "发起人用户 ID" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"user_id">,
    {
      name: "user_id_type",
      type: "string",
      required: false,
      display_name: { en_US: "User ID Type", zh_Hans: "用户 ID 类型" },
      ui: {
        component: "input",
        placeholder: { en_US: "user_id | open_id | union_id", zh_Hans: "user_id | open_id | union_id" },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"user_id_type">,
    {
      name: "locale",
      type: "string",
      required: false,
      display_name: { en_US: "Locale", zh_Hans: "语言" },
      ui: {
        component: "input",
        placeholder: { en_US: "zh-CN", zh_Hans: "zh-CN" },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"locale">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const userIdType =
      typeof p.user_id_type === "string" && p.user_id_type.trim() !== ""
        ? p.user_id_type.trim()
        : undefined
    const userId =
      typeof p.user_id === "string" && p.user_id.trim() !== ""
        ? p.user_id.trim()
        : undefined
    const locale =
      typeof p.locale === "string" && p.locale.trim() !== ""
        ? p.locale.trim()
        : undefined
    const queryParams = parseApprovalGetInstanceQuery(
      {
        ...(userId ? { user_id: userId } : {}),
        ...(userIdType ? { user_id_type: userIdType } : {}),
        ...(locale ? { locale } : {}),
      },
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
