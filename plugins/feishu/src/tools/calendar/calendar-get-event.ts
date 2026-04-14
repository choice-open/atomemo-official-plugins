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
import { parseCalendarGetEventQuery } from "./calendar.zod"
import calendar_get_eventSkill from "./calendar-get-event-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "calendar_get_event",
  module: "calendar",
  name: "获取日程",
  method: "GET",
  path: "/open-apis/calendar/v4/calendars/:calendar_id/events/:event_id",
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
      name: "query_params_json",
      type: "string",
      required: false,
      display_name: t("QUERY_PARAMS"),
      ui: {
        component: "code-editor",
        hint: t("QUERY_PARAMS_HINT"),
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"query_params_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseCalendarGetEventQuery(
      parseOptionalJsonObject(p.query_params_json, "query_params_json"),
    )
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
