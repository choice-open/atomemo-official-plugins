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
import { parseCalendarGetPrimaryQuery } from "./calendar.zod";
import calendar_get_primarySkill from "./calendar-get-primary-skill.md" with { type: "text" };

const fn: FeishuApiFunction = {
  id: "calendar_get_primary",
  module: "calendar",
  name: "查询主日历信息",
  method: "POST",
  path: "/open-apis/calendar/v4/calendars/primary",
};

function parseOptionalBodyJson(
  p: Record<string, unknown>,
): Record<string, unknown> {
  const raw = p.body_json;
  if (typeof raw !== "string" || raw.trim() === "") {
    return {};
  }
  return parseOptionalJsonObject(raw, "body_json");
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
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
      name: "user_id_type",
      type: "string",
      required: false,
      display_name: { en_US: "User ID Type", zh_Hans: "用户 ID 类型" },
      ui: {
        component: "input",
        placeholder: {
          en_US: "open_id | union_id | user_id",
          zh_Hans: "open_id | union_id | user_id",
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"user_id_type">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>;
    const credentialId = readRequiredStringParam(p, "credential_id");
    const userIdType = optionalString(p.user_id_type);
    const queryParams = parseCalendarGetPrimaryQuery({
      ...(userIdType ? { user_id_type: userIdType } : {}),
    });
    const body = parseOptionalBodyJson(p);
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: {},
      queryParams,
      body,
    });
  },
};
