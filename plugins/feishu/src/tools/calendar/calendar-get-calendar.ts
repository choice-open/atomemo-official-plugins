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
import { parseCalendarGetCalendarQuery } from "./calendar.zod"
import calendar_get_calendarSkill from "./calendar-get-calendar-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "calendar_get_calendar",
  module: "calendar",
  name: "查询日历信息",
  method: "GET",
  path: "/open-apis/calendar/v4/calendars/:calendar_id",
}

export const feishuCalendarGetCalendarTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Get calendar",
    zh_Hans: "查询日历信息",
  },
  description: {
    en_US: "This API returns details of the specified calendar.",
    zh_Hans: "获取指定日历详情。",
  },
  skill: calendar_get_calendarSkill,
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
    const queryParams = parseCalendarGetCalendarQuery({})
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: { calendar_id: readRequiredStringParam(p, "calendar_id") },
      queryParams,
      body: {},
    })
  },
}
