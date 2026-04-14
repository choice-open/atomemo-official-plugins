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
import { parseCalendarGetPrimaryQuery } from "./calendar.zod"
import calendar_get_primarySkill from "./calendar-get-primary-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "calendar_get_primary",
  module: "calendar",
  name: "查询主日历信息",
  method: "POST",
  path: "/open-apis/calendar/v4/calendars/primary",
}

function parseOptionalBodyJson(
  p: Record<string, unknown>,
): Record<string, unknown> {
  const raw = p.body_json
  if (typeof raw !== "string" || raw.trim() === "") {
    return {}
  }
  return parseOptionalJsonObject(raw, "body_json")
}

export const feishuCalendarGetPrimaryTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Get primary calendar",
    zh_Hans: "查询主日历信息",
  },
  description: {
    en_US:
      "This API returns primary calendar information for the current identity.",
    zh_Hans: "获取当前身份的主日历信息。",
  },
  skill: calendar_get_primarySkill,
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
      required: false,
      display_name: t("BODY"),
      ui: {
        component: "code-editor",
        hint: {
          en_US: "Optional JSON body (use {} if not needed)",
          zh_Hans: "可选请求体 JSON，无则留空或填 {}",
        },
        placeholder: { en_US: "{}", zh_Hans: "{}" },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseCalendarGetPrimaryQuery(
      parseOptionalJsonObject(p.query_params_json, "query_params_json"),
    )
    const body = parseOptionalBodyJson(p)
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: {},
      queryParams,
      body,
    })
  },
}
