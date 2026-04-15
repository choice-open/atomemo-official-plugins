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
import { parseCalendarBatchGetPrimaryQuery } from "./calendar.zod"
import calendar_batch_get_primarySkill from "./calendar-batch-get-primary-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "calendar_batch_get_primary",
  module: "calendar",
  name: "批量获取主日历信息",
  method: "POST",
  path: "/open-apis/calendar/v4/calendars/primarys",
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed === "" ? undefined : trimmed
}

export const feishuCalendarBatchGetPrimaryTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Batch get primary calendars",
    zh_Hans: "批量获取主日历信息",
  },
  description: {
    en_US: "This API batch-gets primary calendar information.",
    zh_Hans: "批量获取主日历；路径中 primarys 为接口原文。",
  },
  skill: calendar_batch_get_primarySkill,
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
          en_US:
            "Batch primary payload JSON (see Feishu batch_get primary API)",
          zh_Hans: "批量主日历请求体 JSON，字段见飞书「批量获取主日历」文档",
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
    const queryParams = parseCalendarBatchGetPrimaryQuery({
      ...(userIdType ? { user_id_type: userIdType } : {}),
    })
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
