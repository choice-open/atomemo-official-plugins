/**
 * 除 `contact_create_user`（见 contact-create-user.zod.ts 文档级 strict）外，
 * 其余 API 的 query/body 校验：query 为扁平键值；GET 请求体必须为 `{}`；
 * 非 GET 请求体为 JSON 对象（递归结构）。
 */
import { z } from "zod"
import type {
  FeishuApiFunction,
  FeishuApiMethod,
} from "../../feishu-api-functions"
import { feishuJsonValueSchema } from "./json-value"

/**
 * 与各 tool 文件中 `fn.id` / `fn.method` 一致，用于通用 invoke 校验。
 * （不再依赖集中式 FEISHU_API_FUNCTIONS 列表。）
 */
const FEISHU_TOOL_METHODS: ReadonlyArray<{
  id: FeishuApiFunction["id"]
  method: FeishuApiMethod
}> = [
  { id: "approval_batch_get_instance_ids", method: "POST" },
  { id: "approval_create_instance", method: "POST" },
  { id: "approval_get_instance", method: "GET" },
  { id: "approval_list_definitions", method: "GET" },
  { id: "approval_query_instances", method: "POST" },
  { id: "approval_task_add_signer", method: "POST" },
  { id: "approval_task_approve", method: "POST" },
  { id: "approval_task_reject", method: "POST" },
  { id: "approval_task_transfer", method: "POST" },
  { id: "calendar_add_event_attendees", method: "POST" },
  { id: "calendar_batch_get_calendars", method: "POST" },
  { id: "calendar_batch_get_primary", method: "POST" },
  { id: "calendar_create_event", method: "POST" },
  { id: "calendar_create_exchange_binding", method: "POST" },
  { id: "calendar_create_shared_calendar", method: "POST" },
  { id: "calendar_create_timeoff", method: "POST" },
  { id: "calendar_delete_calendar", method: "DELETE" },
  { id: "calendar_delete_event", method: "DELETE" },
  { id: "calendar_delete_timeoff", method: "DELETE" },
  { id: "calendar_get_calendar", method: "GET" },
  { id: "calendar_get_event", method: "GET" },
  { id: "calendar_get_primary", method: "GET" },
  { id: "calendar_list_calendars", method: "GET" },
  { id: "calendar_list_event_attendees", method: "GET" },
  { id: "calendar_list_events", method: "GET" },
  { id: "calendar_list_exchange_bindings", method: "GET" },
  { id: "calendar_patch_calendar", method: "PATCH" },
  { id: "calendar_patch_event", method: "PATCH" },
  { id: "calendar_remove_event_attendee", method: "DELETE" },
  { id: "calendar_search_calendars", method: "POST" },
  { id: "calendar_search_events", method: "POST" },
  { id: "calendar_subscribe", method: "POST" },
  { id: "calendar_unsubscribe", method: "POST" },
  { id: "contact_batch_add_users", method: "POST" },
  { id: "contact_batch_get_departments", method: "POST" },
  { id: "contact_batch_get_user_ids", method: "POST" },
  { id: "contact_batch_get_users", method: "POST" },
  { id: "contact_create_department", method: "POST" },
  { id: "contact_create_user", method: "POST" },
  { id: "contact_delete_department", method: "DELETE" },
  { id: "contact_delete_user", method: "DELETE" },
  { id: "contact_find_users", method: "POST" },
  { id: "contact_find_users_by_department", method: "GET" },
  { id: "contact_get_department", method: "GET" },
  { id: "contact_get_department_children", method: "GET" },
  { id: "contact_get_department_groups", method: "GET" },
  { id: "contact_get_department_parent", method: "GET" },
  { id: "contact_get_scope", method: "GET" },
  { id: "contact_get_user", method: "GET" },
  { id: "contact_list_departments", method: "GET" },
  { id: "contact_patch_department", method: "PATCH" },
  { id: "contact_patch_user", method: "PATCH" },
  { id: "contact_put_department", method: "PUT" },
  { id: "contact_recover_user", method: "POST" },
  { id: "contact_search_departments", method: "POST" },
  { id: "contact_search_users", method: "POST" },
  { id: "im_add_chat_members", method: "POST" },
  { id: "im_batch_messages", method: "POST" },
  { id: "im_create_chat", method: "POST" },
  { id: "im_delete_chat", method: "DELETE" },
  { id: "im_download_file", method: "GET" },
  { id: "im_download_image", method: "GET" },
  { id: "im_get_chat", method: "GET" },
  { id: "im_list_chats", method: "GET" },
  { id: "im_patch_chat", method: "PATCH" },
  { id: "im_remove_chat_member", method: "DELETE" },
  { id: "im_send_message", method: "POST" },
  { id: "im_upload_file", method: "POST" },
  { id: "im_upload_image", method: "POST" },
  { id: "task_add_comment", method: "POST" },
  { id: "task_add_members", method: "POST" },
  { id: "task_complete", method: "POST" },
  { id: "task_create", method: "POST" },
  { id: "task_create_subtask", method: "POST" },
  { id: "task_create_tasklist", method: "POST" },
  { id: "task_delete", method: "DELETE" },
  { id: "task_get", method: "GET" },
  { id: "task_list", method: "GET" },
  { id: "task_list_comments", method: "GET" },
  { id: "task_list_subtasks", method: "GET" },
  { id: "task_list_tasklists", method: "GET" },
  { id: "task_patch", method: "PATCH" },
  { id: "task_remove_member", method: "DELETE" },
]

const emptyBodyStrict = z.object({}).strict()

/** 查询参数 JSON 对象：值通常为 string，部分示例为 number/boolean */
export const feishuGenericQueryParamsSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.null()]),
)

/** 非 GET 请求体：根为对象，键值可为任意 JSON */
export const feishuGenericJsonBodySchema = z.record(
  z.string(),
  feishuJsonValueSchema,
)

function bodySchemaForMethod(method: FeishuApiMethod): z.ZodType<unknown> {
  if (method === "GET") {
    return emptyBodyStrict
  }
  return feishuGenericJsonBodySchema
}

function buildRegistry(): Record<
  string,
  { query: z.ZodType<unknown>; body: z.ZodType<unknown> }
> {
  const out: Record<
    string,
    { query: z.ZodType<unknown>; body: z.ZodType<unknown> }
  > = {}
  for (const fn of FEISHU_TOOL_METHODS) {
    if (fn.id === "contact_create_user") {
      continue
    }
    out[fn.id] = {
      query: feishuGenericQueryParamsSchema,
      body: bodySchemaForMethod(fn.method),
    }
  }
  return out
}

/** 按 `FeishuApiFunction.id` 索引；不含 `contact_create_user` */
export const feishuToolInvokeSchemas: Record<
  Exclude<FeishuApiFunction["id"], "contact_create_user">,
  { query: z.ZodType<unknown>; body: z.ZodType<unknown> }
> = buildRegistry() as Record<
  Exclude<FeishuApiFunction["id"], "contact_create_user">,
  { query: z.ZodType<unknown>; body: z.ZodType<unknown> }
>
