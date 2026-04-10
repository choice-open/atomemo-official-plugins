/**
 * 飞书「获取评论列表」GET /open-apis/task/v2/comments
 * @see https://open.feishu.cn/document/task-v2/comment/list
 */
import { z } from "zod"
import { feishuUserIdTypeSchema, emptyBodyStrictSchema } from "./task-shared.zod"

export const taskListCommentsQuerySchema = z
  .object({
    page_size: z.number().int().min(1).max(100).optional(),
    page_token: z.string().max(100).optional(),
    resource_type: z.enum(["task"]).optional(),
    resource_id: z.string(),
    direction: z.enum(["asc", "desc"]).optional(),
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

export const taskListCommentsBodySchema = emptyBodyStrictSchema

export type TaskListCommentsQuery = z.infer<typeof taskListCommentsQuerySchema>

export function parseTaskListCommentsQuery(
  raw: Record<string, unknown>,
): TaskListCommentsQuery {
  return taskListCommentsQuerySchema.parse(raw)
}

export function parseTaskListCommentsBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return taskListCommentsBodySchema.parse(raw) as Record<string, never>
}
