/**
 * 飞书「获取审批实例详情」GET /open-apis/approval/v4/instances/:instance_id
 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/approval-v4/instance/get
 */
import { z } from "zod"
import { emptyBodyStrictSchema } from "../contact/contact-shared.zod"

/** 文档：查询参数（均为可选） */
export const approvalGetInstanceQuerySchema = z
  .object({
    locale: z.enum(["zh-CN", "en-US", "ja-JP"]).optional(),
    user_id: z.string().optional(),
    user_id_type: z.enum(["open_id", "union_id", "user_id"]).optional(),
  })
  .strict()

/** GET 无请求体，仅允许空对象 */
export const approvalGetInstanceBodySchema = emptyBodyStrictSchema

export type ApprovalGetInstanceQuery = z.infer<
  typeof approvalGetInstanceQuerySchema
>

export function parseApprovalGetInstanceQuery(
  raw: Record<string, unknown>,
): ApprovalGetInstanceQuery {
  return approvalGetInstanceQuerySchema.parse(raw)
}

export function parseApprovalGetInstanceBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return approvalGetInstanceBodySchema.parse(raw) as Record<string, never>
}
