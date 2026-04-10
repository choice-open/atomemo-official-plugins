/**
 * 飞书 Task API 共用的 Zod 片段（与飞书 task v1 文档字段一致）。
 */
import { z } from "zod"

export const feishuUserIdTypeSchema = z.enum(["open_id", "union_id", "user_id"])

export const taskStatusSchema = z.enum(["PENDING", "COMPLETED", "CANCELLED"])

export const emptyBodyStrictSchema = z.object({}).strict()
