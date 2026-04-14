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
import { parseCalendarPatchCalendarQuery } from "./calendar.zod"
import calendar_patch_calendarSkill from "./calendar-patch-calendar-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "calendar_patch_calendar",
  module: "calendar",
  name: "更新日历信息",
  method: "PATCH",
  path: "/open-apis/calendar/v4/calendars/:calendar_id",
}

export const feishuCalendarPatchCalendarTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Patch calendar",
    zh_Hans: "更新日历信息",
  },
  description: {
    en_US: "This API updates properties of the specified calendar.",
    zh_Hans: "更新指定日历属性。",
  },
  skill: calendar_patch_calendarSkill,
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
          en_US: "Calendar patch payload JSON (see Feishu update calendar API)",
          zh_Hans: "更新日历请求体 JSON，字段见飞书「更新日历」文档",
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseCalendarPatchCalendarQuery(
      parseOptionalJsonObject(p.query_params_json, "query_params_json"),
    )
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
