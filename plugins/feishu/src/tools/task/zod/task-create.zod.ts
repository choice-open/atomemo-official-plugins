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
    relative_fire_minute: z.number().int(),
  })
  .strict()

const taskMemberSchema = z
  .object({
    id: z.string(),
    type: z.enum(["user", "app"]).optional(),
    role: z.enum(["assignee", "follower"]).optional(),
    name: z.string().optional(),
  })
  .strict()

const taskCustomFieldSchema = z
  .object({
    guid: z.string(),
    value: z.string().optional(),
    number_value: z.string().optional(),
    datetime_value: z.string().optional(),
    member_value: z.array(taskMemberSchema).optional(),
    single_select_value: z.string().optional(),
    multi_select_value: z.array(z.string()).optional(),
  })
  .strict()

const taskCustomCompleteSchema = z
  .object({
    enable: z.boolean().optional(),
    pc: z
      .object({
        type: z.string().optional(),
        content: z.string().optional(),
      })
      .strict()
      .optional(),
    mobile: z
      .object({
        type: z.string().optional(),
        content: z.string().optional(),
      })
      .strict()
      .optional(),
  })
  .strict()

const taskRichContentSchema = z
  .object({
    content: z.string().optional(),
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
    summary: z.string().min(1).max(3000),
    description: z.string().max(3000).optional(),
    rich_summary: taskRichContentSchema.optional(),
    rich_description: taskRichContentSchema.optional(),
    extra: z.string().optional(),
    due: taskDueSchema.optional(),
    start: taskStartSchema.optional(),
    reminders: z.array(taskReminderSchema).optional(),
    origin: taskOriginSchema.optional(),
    can_edit: z.boolean().optional(),
    members: z.array(taskMemberSchema).optional(),
    tasklists: z.array(z.string()).optional(),
    client_token: z.string().min(10).max(100).optional(),
    mode: z.number().int().min(1).max(3).optional(),
    is_milestone: z.boolean().optional(),
    custom_fields: z.array(taskCustomFieldSchema).optional(),
    custom_complete: taskCustomCompleteSchema.optional(),
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
