/**
 * 飞书「创建任务」POST /open-apis/task/v2/tasks
 * 查询参数、请求体字段与官方文档一致，使用 .strict()。
 * @see https://open.feishu.cn/document/server-docs/task-v2/task/create
 */
import { z } from "zod"
import { feishuUserIdTypeSchema } from "./task-shared.zod"

const taskDueSchema = z
  .object({
    timestamp: z.string().optional(),
    timezone: z.string().optional(),
    is_all_day: z.boolean().optional(),
  })
  .strict()

const taskStartSchema = z
  .object({
    timestamp: z.string().optional(),
    timezone: z.string().optional(),
    is_all_day: z.boolean().optional(),
  })
  .strict()

const taskReminderSchema = z
  .object({
    time_before_task_due_in_minutes: z.number().int().optional(),
    create_before_task_start_in_minutes: z.number().int().optional(),
  })
  .strict()

const taskOriginHrefSchema = z
  .object({
    url: z.string().optional(),
    title: z.string().optional(),
  })
  .strict()

const taskOriginSchema = z
  .object({
    platform_i18n_name: z.string().optional(),
    href: taskOriginHrefSchema.optional(),
  })
  .strict()

/** 查询参数 */
export const taskCreateQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()

/** 请求体 */
export const taskCreateBodySchema = z
  .object({
    tasklist_guid: z.string().optional(),
    tasklist_id: z.string().optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    rich_summary: z.string().optional(),
    rich_description: z.string().optional(),
    extra: z.string().optional(),
    due: taskDueSchema.optional(),
    start: taskStartSchema.optional(),
    reminders: z.array(taskReminderSchema).optional(),
    origin: taskOriginSchema.optional(),
    can_edit: z.boolean().optional(),
    custom_fields: z.string().optional(),
    members: z.array(z.string()).optional(),
    tasklists: z.array(z.string()).optional(),
    client_token: z.string().optional(),
    mode: z.enum(["task", "checklist"]).optional(),
    is_milestone: z.boolean().optional(),
  })
  .strict()

export type TaskCreateQuery = z.infer<typeof taskCreateQuerySchema>
export type TaskCreateBody = z.infer<typeof taskCreateBodySchema>

export function parseTaskCreateQuery(
  raw: Record<string, unknown>,
): TaskCreateQuery {
  return taskCreateQuerySchema.parse(raw)
}

export function parseTaskCreateBody(
  raw: Record<string, unknown>,
): TaskCreateBody {
  return taskCreateBodySchema.parse(raw)
}
