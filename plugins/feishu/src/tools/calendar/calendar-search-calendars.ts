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
import { parseCalendarSearchCalendarsQuery } from "./calendar.zod"
import calendar_search_calendarsSkill from "./calendar-search-calendars-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "calendar_search_calendars",
  module: "calendar",
  name: "搜索日历",
  method: "POST",
  path: "/open-apis/calendar/v4/calendars/search",
}

export const feishuCalendarSearchCalendarsTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Search calendars",
    zh_Hans: "搜索日历",
  },
  description: {
    en_US: "This API searches calendars by conditions.",
    zh_Hans: "按条件搜索日历。",
  },
  skill: calendar_search_calendarsSkill,
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
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"query_params_json">,
    {
      name: "body_json",
      type: "string",
      required: true,
      display_name: t("BODY"),
      ui: {
        component: "code-editor",
        hint: {
          en_US: "Search payload JSON (see Feishu search calendar API)",
          zh_Hans: "搜索请求体 JSON，字段见飞书「搜索日历」文档",
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseCalendarSearchCalendarsQuery(
      parseOptionalJsonObject(p.query_params_json, "query_params_json"),
    )
    const body = parseOptionalJsonObject(
      readRequiredStringParam(p, "body_json"),
      "body_json",
    )
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: {},
      queryParams,
      body,
    })
  },
}
