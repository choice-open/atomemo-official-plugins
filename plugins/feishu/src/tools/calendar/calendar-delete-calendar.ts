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
import { parseCalendarDeleteCalendarQuery } from "./calendar.zod"
import calendar_delete_calendarSkill from "./calendar-delete-calendar-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "calendar_delete_calendar",
  module: "calendar",
  name: "删除共享日历",
  method: "DELETE",
  path: "/open-apis/calendar/v4/calendars/:calendar_id",
}

export const feishuCalendarDeleteCalendarTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Delete shared calendar",
    zh_Hans: "删除共享日历",
  },
  description: {
    en_US: "This API deletes the specified calendar.",
    zh_Hans: "删除指定日历。",
  },
  skill: calendar_delete_calendarSkill,
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
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseCalendarDeleteCalendarQuery({})
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: { calendar_id: readRequiredStringParam(p, "calendar_id") },
      queryParams,
      body: {},
    })
  },
}
