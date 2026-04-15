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
import { parseCalendarGetEventQuery } from "./calendar.zod";
import calendar_get_eventSkill from "./calendar-get-event-skill.md" with { type: "text" };

const fn: FeishuApiFunction = {
  id: "calendar_get_event",
  module: "calendar",
  name: "获取日程",
  method: "GET",
  path: "/open-apis/calendar/v4/calendars/:calendar_id/events/:event_id",
};

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export const feishuCalendarGetEventTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Get event",
    zh_Hans: "获取日程",
  },
  description: {
    en_US: "Get details for the specified event.",
    zh_Hans: "获取指定日程详情。",
  },
  skill: calendar_get_eventSkill,
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
      name: "event_id",
      type: "string",
      required: true,
      display_name: { en_US: "Event ID", zh_Hans: "日程 ID" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"event_id">,
    {
      name: "need_meeting_settings",
      type: "boolean",
      required: false,
      display_name: {
        en_US: "Need Meeting Settings",
        zh_Hans: "是否返回会前设置",
      },
      ui: {
        component: "switch",
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"need_meeting_settings">,
    {
      name: "need_attendee",
      type: "boolean",
      required: false,
      ui: {
        component: "switch",
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"need_attendee">,
    {
      name: "max_attendee_num",
      type: "integer",
      required: false,
      display_name: {
        en_US: "Max Attendee Number",
        zh_Hans: "返回最大参与人数",
      },
      ui: {
        component: "number-input",
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"max_attendee_num">,
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
    const queryParams = parseCalendarGetEventQuery({
      ...(optionalString(p.need_meeting_settings)
        ? { need_meeting_settings: optionalString(p.need_meeting_settings) }
        : {}),
      ...(optionalString(p.need_attendee)
        ? { need_attendee: optionalString(p.need_attendee) }
        : {}),
      ...(optionalString(p.max_attendee_num)
        ? { max_attendee_num: optionalString(p.max_attendee_num) }
        : {}),
      ...(optionalString(p.user_id_type)
        ? { user_id_type: optionalString(p.user_id_type) }
        : {}),
    });
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: {
        calendar_id: readRequiredStringParam(p, "calendar_id"),
        event_id: readRequiredStringParam(p, "event_id"),
      },
      queryParams,
      body: {},
    });
  },
};
