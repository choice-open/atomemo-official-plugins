import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import {
  invokeFeishuOpenApi,
  parseOptionalJsonObject,
  readRequiredStringParam,
} from "../feishu/request";
import type { FeishuApiFunction } from "../feishu-api-functions";
import {
  parseCalendarGetEventQueryParams,
  parseCalendarGetEventBody,
} from "./zod/calendar-get-event.zod";

import calendar_get_eventSkill from "./calendar-get-event-skill.md" with { type: "text" }

const fn: FeishuApiFunction = {
  id: "calendar_get_event",
  legacy_id: "f049",
  module: "calendar",
  name: "获取日程",
  method: "GET",
  path: "/open-apis/calendar/v4/calendars/{calendar_id}/events/{event_id}",
};

export const feishuCalendarGetEventTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: `[${fn.module}] ${fn.name}`,
    zh_Hans: `[${fn.module}] ${fn.name}`,
  },
  description: {
    en_US: `${fn.method} ${fn.path} (${fn.id}, legacy: ${fn.legacy_id})`,
    zh_Hans: `${fn.method} ${fn.path}（${fn.id}，兼容: ${fn.legacy_id}）`,
  },
  skill: calendar_get_eventSkill,
  icon: "🪶",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "feishu-app-credential",
      display_name: { en_US: "Credential", zh_Hans: "凭证" },
      ui: { component: "credential-select" },
    } satisfies Property<"credential_id">,
    {
      name: "calendar_id",
      type: "string",
      required: true,
      display_name: { en_US: "calendar_id", zh_Hans: "calendar_id" },
      ui: {
        component: "input",
        hint: {
          en_US: "URL path parameter: calendar_id",
          zh_Hans: "URL 路径参数：calendar_id",
        },
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"calendar_id">,
    {
      name: "event_id",
      type: "string",
      required: true,
      display_name: { en_US: "event_id", zh_Hans: "event_id" },
      ui: {
        component: "input",
        hint: {
          en_US: "URL path parameter: event_id",
          zh_Hans: "URL 路径参数：event_id",
        },
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"event_id">,
    {
      name: "query_params_json",
      type: "string",
      required: false,
      display_name: {
        en_US: "Query Params",
        zh_Hans: "查询参数",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "HTTP query object as JSON string (optional)",
          zh_Hans: "HTTP 查询参数，JSON 对象字符串（可选）",
        },
        placeholder: {
          en_US: '{"page_size":20}',
          zh_Hans: '{"page_size":20}',
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"query_params_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>;
    const credentialId = readRequiredStringParam(p, "credential_id");
    const pathParams = {
      calendar_id: readRequiredStringParam(p, "calendar_id"),
      event_id: readRequiredStringParam(p, "event_id"),
    };
    const queryRaw = parseOptionalJsonObject(
      p.query_params_json,
      "query_params_json",
    );
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams: parseCalendarGetEventQueryParams(queryRaw),
      body: parseCalendarGetEventBody({}),
    });
  },
};
