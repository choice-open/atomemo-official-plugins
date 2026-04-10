/**
 * 飞书「创建审批实例」POST /open-apis/approval/v4/instances
 * 查询参数、请求体字段与官方文档一致，使用 .strict()。
 * @see https://open.feishu.cn/document/server-docs/approval-v4/instance/create
 */
import { z } from "zod"
import { feishuUserIdTypeSchema } from "./approval-shared.zod"

const nodeApproverSchema = z
  .object({
    key: z.string(),
    value: z.array(z.string()),
  })
  .strict()

const nodeCcSchema = z
  .object({
    key: z.string(),
    value: z.array(z.string()),
  })
  .strict()

const i18nResourceTextSchema = z
  .object({
    key: z.string(),
    value: z.string(),
    is_default: z.boolean(),
  })
  .strict()

const i18nResourceSchema = z
  .object({
    locale: z.string(),
    texts: z.array(i18nResourceTextSchema),
  })
  .strict()

const nodeAutoApprovalSchema = z
  .object({
    node_id_type: z.enum(["CUSTOM", "NON_CUSTOM"]).optional(),
    node_id: z.string().optional(),
  })
  .strict()

/** 查询参数 */
export const approvalCreateInstanceQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

/** 请求体 */
export const approvalCreateInstanceBodySchema = z
  .object({
    approval_code: z.string(),
    user_id: z.string().optional(),
    open_id: z.string().optional(),
    department_id: z.string().optional(),
    form: z.string(),
    node_approver_user_id_list: z.array(nodeApproverSchema).optional(),
    node_approver_open_id_list: z.array(nodeApproverSchema).optional(),
    node_cc_user_id_list: z.array(nodeCcSchema).optional(),
    node_cc_open_id_list: z.array(nodeCcSchema).optional(),
    uuid: z.string().optional(),
    allow_resubmit: z.boolean().optional(),
    allow_submit_again: z.boolean().optional(),
    cancel_bot_notification: z.string().optional(),
    forbid_revoke: z.boolean().optional(),
    i18n_resources: z.array(i18nResourceSchema).optional(),
    title: z.string().optional(),
    title_display_method: z.number().int().optional(),
    node_auto_approval_list: z.array(nodeAutoApprovalSchema).optional(),
  })
  .strict()

export type ApprovalCreateInstanceQuery = z.infer<
  typeof approvalCreateInstanceQuerySchema
>
export type ApprovalCreateInstanceBody = z.infer<
  typeof approvalCreateInstanceBodySchema
>

export function parseApprovalCreateInstanceQuery(
  raw: Record<string, unknown>,
): ApprovalCreateInstanceQuery {
  return approvalCreateInstanceQuerySchema.parse(raw)
}

export function parseApprovalCreateInstanceBody(
  raw: Record<string, unknown>,
): ApprovalCreateInstanceBody {
  return approvalCreateInstanceBodySchema.parse(raw)
}
