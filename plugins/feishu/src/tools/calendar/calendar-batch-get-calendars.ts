import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../i18n/i18n-node";
import {
  invokeFeishuOpenApi,
  parseOptionalJsonObject,
  readRequiredStringParam,
} from "../feishu/request";
import type { FeishuApiFunction } from "../feishu-api-functions";
import { parseCalendarBatchGetCalendarsQuery } from "./calendar.zod";
import calendar_batch_get_calendarsSkill from "./calendar-batch-get-calendars-skill.md" with { type: "text" };

const fn: FeishuApiFunction = {
  id: "calendar_batch_get_calendars",
  module: "calendar",
  name: "批量查询日历信息",
  method: "POST",
  path: "/open-apis/calendar/v4/calendars/mget",
};

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export const feishuCalendarBatchGetCalendarsTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Batch get calendars",
    zh_Hans: "批量查询日历信息",
  },
  description: {
    en_US: "This API batch-gets calendars by calendar ID list.",
    zh_Hans: "根据日历 ID 列表批量获取日历。",
  },
  skill: calendar_batch_get_calendarsSkill,
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
      name: "body_json",
      type: "string",
      required: true,
      display_name: t("BODY"),
      ui: {
        component: "code-editor",
        hint: {
          en_US: 'Typically {"calendar_ids":["..."]}',
          zh_Hans: '一般为 {"calendar_ids":["..."]}，详见官方文档',
        },
        placeholder: {
          en_US: '{"calendar_ids":["feishu.cn_xxx@group.calendar.feishu.cn"]}',
          zh_Hans:
            '{"calendar_ids":["feishu.cn_xxx@group.calendar.feishu.cn"]}',
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>;
    const credentialId = readRequiredStringParam(p, "credential_id");
    const body = parseOptionalJsonObject(
      readRequiredStringParam(p, "body_json"),
      "body_json",
    );
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: {},
      body,
    });
  },
};
