/**
 * 飞书 Approval API 共用的 Zod 片段（与飞书 approval v4 文档字段一致）。
 */
import { z } from "zod"

export const feishuUserIdTypeSchema = z.enum(["open_id", "union_id", "user_id"])

export const approvalStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
])

export const emptyBodyStrictSchema = z.object({}).strict()
