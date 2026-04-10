/**
 * 飞书「批量获取审批实例ID」GET /open-apis/approval/v4/instances
 * @see https://open.feishu.cn/document/server-docs/approval-v4/instance/list
 */
import { z } from "zod"
import { emptyBodyStrictSchema } from "../contact/contact-shared.zod"

/** 文档：查询参数 */
export const approvalBatchGetInstanceIdsQuerySchema = z
  .object({
    approval_code: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    page_size: z.number().int().min(1).max(100).optional(),
    page_token: z.string().optional(),
  })
  .strict()

/** GET 无请求体，仅允许空对象 */
export const approvalBatchGetInstanceIdsBodySchema = emptyBodyStrictSchema

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
): Record<string, never> {
  return approvalBatchGetInstanceIdsBodySchema.parse(raw) as Record<string, never>
}
