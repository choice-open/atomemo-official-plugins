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
import { parseCalendarCreateSharedCalendarQuery } from "./calendar.zod"
import calendar_create_shared_calendarSkill from "./calendar-create-shared-calendar-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "calendar_create_shared_calendar",
  module: "calendar",
  name: "创建共享日历",
  method: "POST",
  path: "/open-apis/calendar/v4/calendars",
}

export const feishuCalendarCreateSharedCalendarTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Create shared calendar",
    zh_Hans: "创建共享日历",
  },
  description: {
    en_US: "This API creates a calendar entity (including shared calendars).",
    zh_Hans: "创建日历实体（含共享日历）。",
  },
  skill: calendar_create_shared_calendarSkill,
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
        placeholder: { en_US: "{}", zh_Hans: "{}" },
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
          en_US:
            "Calendar create payload JSON (see Feishu calendar create API)",
          zh_Hans: "创建日历请求体 JSON，字段见飞书「创建日历」文档",
        },
        placeholder: {
          en_US: '{"summary":"..."}',
          zh_Hans: '{"summary":"..."}',
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseCalendarCreateSharedCalendarQuery(
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
