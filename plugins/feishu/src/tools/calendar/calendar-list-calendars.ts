import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { invokeFeishuOpenApi, readRequiredStringParam } from "../feishu/request"
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

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed === "" ? undefined : trimmed
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
      name: "page_size",
      type: "string",
      required: false,
      display_name: { en_US: "Page Size", zh_Hans: "分页大小" },
      ui: {
        component: "input",
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"page_size">,
    {
      name: "page_token",
      type: "string",
      required: false,
      display_name: { en_US: "Page Token", zh_Hans: "分页游标" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"page_token">,
    {
      name: "sync_token",
      type: "string",
      required: false,
      display_name: { en_US: "Sync Token", zh_Hans: "增量同步 Token" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"sync_token">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseCalendarListCalendarsQuery({
      ...(optionalString(p.page_size) ? { page_size: optionalString(p.page_size) } : {}),
      ...(optionalString(p.page_token)
        ? { page_token: optionalString(p.page_token) }
        : {}),
      ...(optionalString(p.sync_token)
        ? { sync_token: optionalString(p.sync_token) }
        : {}),
    })
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: {},
      queryParams,
      body: {},
    })
  },
}
