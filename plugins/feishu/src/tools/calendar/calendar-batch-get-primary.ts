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
    const queryParams = parseCalendarBatchGetPrimaryQuery(
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
