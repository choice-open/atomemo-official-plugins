/**
 * 飞书「获取审批定义列表」GET /open-apis/approval/v4/approvals
 */
import { z } from "zod"
import { emptyBodyStrictSchema } from "./approval-shared.zod"

export const approvalListDefinitionsQuerySchema = z
  .object({
    page_size: z.number().int().min(1).max(100).optional(),
    page_token: z.string().optional(),
  })
  .strict()

export const approvalListDefinitionsBodySchema = emptyBodyStrictSchema

export type ApprovalListDefinitionsQuery = z.infer<
  typeof approvalListDefinitionsQuerySchema
>

export function parseApprovalListDefinitionsQuery(
  raw: Record<string, unknown>,
): ApprovalListDefinitionsQuery {
  return approvalListDefinitionsQuerySchema.parse(raw)
}

export function parseApprovalListDefinitionsBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return approvalListDefinitionsBodySchema.parse(raw) as Record<string, never>
}
