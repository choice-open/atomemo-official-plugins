/**
 * 飞书「获取任务的子任务列表」GET /open-apis/task/v2/tasks/:task_guid/subtasks
 * @see https://open.feishu.cn/document/task-v2/task-subtask/list
 */
import { z } from "zod"
import { feishuUserIdTypeSchema, emptyBodyStrictSchema } from "./task-shared.zod"

export const taskListSubtasksQuerySchema = z
  .object({
    page_size: z.number().int().min(1).max(100).optional(),
    page_token: z.string().optional(),
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

export const taskListSubtasksBodySchema = emptyBodyStrictSchema

export type TaskListSubtasksQuery = z.infer<typeof taskListSubtasksQuerySchema>

export function parseTaskListSubtasksQuery(
  raw: Record<string, unknown>,
): TaskListSubtasksQuery {
  return taskListSubtasksQuerySchema.parse(raw)
}

export function parseTaskListSubtasksBody(
  raw: Record<string, unknown>,
): Record<string, never> {
  return taskListSubtasksBodySchema.parse(raw) as Record<string, never>
}
