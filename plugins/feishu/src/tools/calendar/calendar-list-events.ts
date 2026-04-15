import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../i18n/i18n-node";
import {
  invokeFeishuOpenApi,
  readRequiredStringParam,
} from "../feishu/request";
import type { FeishuApiFunction } from "../feishu-api-functions";
import { parseCalendarListEventsQuery } from "./calendar.zod";
import calendar_list_eventsSkill from "./calendar-list-events-skill.md" with { type: "text" };

const fn: FeishuApiFunction = {
  id: "calendar_list_events",
  module: "calendar",
  name: "获取日程列表",
  method: "GET",
  path: "/open-apis/calendar/v4/calendars/:calendar_id/events",
};

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export const feishuCalendarListEventsTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "List events",
    zh_Hans: "获取日程列表",
  },
  description: {
    en_US: "List events under the specified calendar.",
    zh_Hans: "分页或增量获取某日历下的日程。",
  },
  skill: calendar_list_eventsSkill,
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
    {
      name: "anchor_time",
      type: "string",
      required: false,
      display_name: { en_US: "Anchor Time", zh_Hans: "时间锚点" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"anchor_time">,
    {
      name: "page_token",
      type: "string",
      required: false,
      display_name: { en_US: "Page Token", zh_Hans: "分页游标" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"page_token">,
    {
      name: "sync_token",
      type: "string",
      required: false,
      display_name: { en_US: "Sync Token", zh_Hans: "增量同步 Token" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"sync_token">,
    {
      name: "start_time",
      type: "string",
      required: false,
      display_name: { en_US: "Start Time", zh_Hans: "开始时间（秒时间戳）" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"start_time">,
    {
      name: "end_time",
      type: "string",
      required: false,
      display_name: { en_US: "End Time", zh_Hans: "结束时间（秒时间戳）" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"end_time">,
    {
      name: "user_id_type",
      type: "string",
      required: false,
      display_name: { en_US: "User ID Type", zh_Hans: "用户 ID 类型" },
      ui: {
        component: "input",
        placeholder: {
          en_US: "open_id | union_id | user_id",
          zh_Hans: "open_id | union_id | user_id",
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"user_id_type">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>;
    const credentialId = readRequiredStringParam(p, "credential_id");
    const queryParams = parseCalendarListEventsQuery({
      ...(optionalString(p.page_size)
        ? { page_size: optionalString(p.page_size) }
        : {}),
      ...(optionalString(p.anchor_time)
        ? { anchor_time: optionalString(p.anchor_time) }
        : {}),
      ...(optionalString(p.page_token)
        ? { page_token: optionalString(p.page_token) }
        : {}),
      ...(optionalString(p.sync_token)
        ? { sync_token: optionalString(p.sync_token) }
        : {}),
      ...(optionalString(p.start_time)
        ? { start_time: optionalString(p.start_time) }
        : {}),
      ...(optionalString(p.end_time)
        ? { end_time: optionalString(p.end_time) }
        : {}),
      ...(optionalString(p.user_id_type)
        ? { user_id_type: optionalString(p.user_id_type) }
        : {}),
    });
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: { calendar_id: readRequiredStringParam(p, "calendar_id") },
      queryParams,
      body: {},
    });
  },
};
