import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  invokeFeishuOpenApi,
  parseOptionalJsonObject,
  readRequiredStringParam,
} from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import { parseCalendarSearchEventsQuery } from "./calendar.zod"
import calendar_search_eventsSkill from "./calendar-search-events-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "calendar_search_events",
  module: "calendar",
  name: "搜索日程",
  method: "POST",
  path: "/open-apis/calendar/v4/calendars/:calendar_id/events/search",
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed === "" ? undefined : trimmed
}

export const feishuCalendarSearchEventsTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Search events",
    zh_Hans: "搜索日程",
  },
  description: {
    en_US: "Search events in the specified calendar.",
    zh_Hans: "在指定日历下按条件搜索日程。",
  },
  skill: calendar_search_eventsSkill,
  icon: "🪶",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "feishu-app-credential",
      display_name: t("CREDENTIAL"),
      ui: { component: "credential-select" },
    } satisfies Property<"credential_id">,
    {
      name: "calendar_id",
      type: "string",
      required: true,
      display_name: { en_US: "Calendar ID", zh_Hans: "日历 ID" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"calendar_id">,
    {
      name: "page_size",
      type: "string",
      required: false,
      display_name: { en_US: "Page Size", zh_Hans: "分页大小" },
      ui: {
        component: "input",
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"page_size">,
    { name: "page_token", type: "string", required: false, display_name: { en_US: "Page Token", zh_Hans: "分页游标" }, ui: { component: "input", width: "full", support_expression: true } } satisfies Property<"page_token">,
    { name: "user_id_type", type: "string", required: false, display_name: { en_US: "User ID Type", zh_Hans: "用户 ID 类型" }, ui: { component: "input", placeholder: { en_US: "open_id | union_id | user_id", zh_Hans: "open_id | union_id | user_id" }, width: "full", support_expression: true } } satisfies Property<"user_id_type">,
    {
      name: "body_json",
      type: "string",
      required: true,
      display_name: t("BODY"),
      ui: {
        component: "code-editor",
        hint: {
          en_US: "Search events payload JSON",
          zh_Hans: "搜索日程请求体 JSON",
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseCalendarSearchEventsQuery({
      ...(optionalString(p.page_size) ? { page_size: optionalString(p.page_size) } : {}),
      ...(optionalString(p.page_token)
        ? { page_token: optionalString(p.page_token) }
        : {}),
      ...(optionalString(p.user_id_type)
        ? { user_id_type: optionalString(p.user_id_type) }
        : {}),
    })
    const body = parseOptionalJsonObject(
      readRequiredStringParam(p, "body_json"),
      "body_json",
    )
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: { calendar_id: readRequiredStringParam(p, "calendar_id") },
      queryParams,
      body,
    })
  },
}
