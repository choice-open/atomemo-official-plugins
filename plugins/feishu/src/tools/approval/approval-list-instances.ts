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
      name: "approval_code",
      type: "string",
      required: true,
      display_name: { en_US: "Approval Code", zh_Hans: "审批定义 Code" },
      ui: {
        component: "input",
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"approval_code">,
    {
      name: "start_time",
      type: "string",
      required: true,
      display_name: { en_US: "Start Time", zh_Hans: "开始时间（毫秒时间戳）" },
      ui: {
        component: "input",
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"start_time">,
    {
      name: "end_time",
      type: "string",
      required: true,
      display_name: { en_US: "End Time", zh_Hans: "结束时间（毫秒时间戳）" },
      ui: {
        component: "input",
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"end_time">,
    {
      name: "page_size",
      type: "string",
      required: false,
      display_name: { en_US: "Page Size", zh_Hans: "分页大小" },
      ui: {
        component: "input",
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"page_size">,
    {
      name: "page_token",
      type: "string",
      required: false,
      display_name: { en_US: "Page Token", zh_Hans: "分页游标" },
      ui: {
        component: "input",
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"page_token">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const optionalString = (key: string): string | undefined => {
      const raw = p[key]
      if (typeof raw !== "string") return undefined
      const trimmed = raw.trim()
      return trimmed === "" ? undefined : trimmed
    }
    const approvalCode = readRequiredStringParam(p, "approval_code")
    const startTime = readRequiredStringParam(p, "start_time")
    const endTime = readRequiredStringParam(p, "end_time")
    const pageSize = optionalString("page_size")
    const pageToken = optionalString("page_token")
    const queryParams = parseApprovalListInstancesQuery({
      approval_code: approvalCode,
      start_time: startTime,
      end_time: endTime,
      ...(pageSize ? { page_size: pageSize } : {}),
      ...(pageToken ? { page_token: pageToken } : {}),
    })
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
