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
import { parseCalendarListCalendarsQuery } from "./calendar.zod"
import calendar_list_calendarsSkill from "./calendar-list-calendars-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "calendar_list_calendars",
  module: "calendar",
  name: "查询日历列表",
  method: "GET",
  path: "/open-apis/calendar/v4/calendars",
}

export const feishuCalendarListCalendarsTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "List calendars",
    zh_Hans: "查询日历列表",
  },
  description: {
    en_US:
      "This API returns the list of calendars visible to the current identity.",
    zh_Hans: "获取当前身份可见的日历列表。",
  },
  skill: calendar_list_calendarsSkill,
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
      name: "query_params_json",
      type: "string",
      required: false,
      display_name: t("QUERY_PARAMS"),
      ui: {
        component: "code-editor",
        hint: t("QUERY_PARAMS_HINT"),
        placeholder: {
          en_US: '{"page_size":20}',
          zh_Hans: '{"page_size":20}',
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"query_params_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseCalendarListCalendarsQuery(
      parseOptionalJsonObject(p.query_params_json, "query_params_json"),
    )
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: {},
      queryParams,
      body: {},
    })
  },
}
