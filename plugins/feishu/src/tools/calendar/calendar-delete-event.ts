import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  invokeFeishuOpenApi,
  readRequiredStringParam,
} from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import { parseCalendarDeleteEventQuery } from "./calendar.zod"
import calendar_delete_eventSkill from "./calendar-delete-event-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "calendar_delete_event",
  module: "calendar",
  name: "删除日程",
  method: "DELETE",
  path: "/open-apis/calendar/v4/calendars/:calendar_id/events/:event_id",
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed === "" ? undefined : trimmed
}

export const feishuCalendarDeleteEventTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Delete event",
    zh_Hans: "删除日程",
  },
  description: {
    en_US: "Delete the specified event.",
    zh_Hans: "删除指定日程。",
  },
  skill: calendar_delete_eventSkill,
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
      name: "need_notification",
      type: "string",
      required: false,
      display_name: { en_US: "Need Notification", zh_Hans: "是否通知参与人" },
      ui: {
        component: "input",
        placeholder: { en_US: "true | false", zh_Hans: "true | false" },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"need_notification">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const needNotification = optionalString(p.need_notification)
    const queryParams = parseCalendarDeleteEventQuery({
      ...(needNotification ? { need_notification: needNotification } : {}),
    })
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: {
        calendar_id: readRequiredStringParam(p, "calendar_id"),
        event_id: readRequiredStringParam(p, "event_id"),
      },
      queryParams,
      body: {},
    })
  },
}
