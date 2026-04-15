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
import { parseCalendarPatchEventQuery } from "./calendar.zod"
import calendar_patch_eventSkill from "./calendar-patch-event-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "calendar_patch_event",
  module: "calendar",
  name: "更新日程",
  method: "PATCH",
  path: "/open-apis/calendar/v4/calendars/:calendar_id/events/:event_id",
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed === "" ? undefined : trimmed
}

export const feishuCalendarPatchEventTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Patch event",
    zh_Hans: "更新日程",
  },
  description: {
    en_US: "Update the specified event.",
    zh_Hans: "更新指定日程。",
  },
  skill: calendar_patch_eventSkill,
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
      name: "user_id_type",
      type: "string",
      required: false,
      display_name: { en_US: "User ID Type", zh_Hans: "用户 ID 类型" },
      ui: {
        component: "input",
        placeholder: { en_US: "open_id | union_id | user_id", zh_Hans: "open_id | union_id | user_id" },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"user_id_type">,
    {
      name: "body_json",
      type: "string",
      required: true,
      display_name: t("BODY"),
      ui: {
        component: "code-editor",
        hint: {
          en_US: "Event patch payload JSON",
          zh_Hans: "更新日程请求体 JSON",
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const userIdType = optionalString(p.user_id_type)
    const queryParams = parseCalendarPatchEventQuery({
      ...(userIdType ? { user_id_type: userIdType } : {}),
    })
    const body = parseOptionalJsonObject(
      readRequiredStringParam(p, "body_json"),
      "body_json",
    )
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: {
        calendar_id: readRequiredStringParam(p, "calendar_id"),
        event_id: readRequiredStringParam(p, "event_id"),
      },
      queryParams,
      body,
    })
  },
}
