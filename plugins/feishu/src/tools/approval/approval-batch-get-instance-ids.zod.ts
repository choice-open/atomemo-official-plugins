/**
 * 飞书「批量获取审批实例ID」POST /open-apis/approval/v4/instances/batch_get_id
 * @see https://open.feishu.cn/document/server-docs/approval-v4/instance/list
 */
import { z } from "zod"
import { emptyBodyStrictSchema } from "../contact/contact-shared.zod"

/** 文档：查询参数（均为可选） */
export const approvalBatchGetInstanceIdsQuerySchema = z
  .object({
    page_size: z.number().int().min(1).max(100).optional(),
    page_token: z.string().optional(),
  })
  .strict()

/** 文档：请求体 */
export const approvalBatchGetInstanceIdsBodySchema = z
  .object({
    approval_code: z.string(),
    start_time: z.string(),
    end_time: z.string(),
  })
  .strict()

export type ApprovalBatchGetInstanceIdsQuery = z.infer<
  typeof approvalBatchGetInstanceIdsQuerySchema
>

export function parseApprovalBatchGetInstanceIdsQuery(
  raw: Record<string, unknown>,
): ApprovalBatchGetInstanceIdsQuery {
  return approvalBatchGetInstanceIdsQuerySchema.parse(raw)
}

export function parseApprovalBatchGetInstanceIdsBody(
  raw: Record<string, unknown>,
): Record<string, unknown> {
  return approvalBatchGetInstanceIdsBodySchema.parse(raw)
}
