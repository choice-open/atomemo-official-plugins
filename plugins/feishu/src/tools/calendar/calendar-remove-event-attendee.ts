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
  parseCalendarActionQuery,
  parseCalendarEmptyBody,
} from "./zod/calendar-actions.zod";

const fn: FeishuApiFunction = {
  id: "calendar_remove_event_attendee",
  legacy_id: "f056",
  module: "calendar",
  name: "移除日程参与者",
  method: "DELETE",
  path: "/open-apis/calendar/v4/calendars/:calendar_id/events/:event_id/attendees/:attendee_id",
};

export const feishuCalendarRemoveEventAttendeeTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: `[${fn.module}] ${fn.name}`,
    zh_Hans: `[${fn.module}] ${fn.name}`,
  },
  description: {
    en_US: `${fn.method} ${fn.path} (${fn.id}, legacy: ${fn.legacy_id})`,
    zh_Hans: `${fn.method} ${fn.path}（${fn.id}，兼容: ${fn.legacy_id}）`,
  },
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
      name: "attendee_id",
      type: "string",
      required: true,
      display_name: { en_US: "attendee_id", zh_Hans: "attendee_id" },
      ui: {
        component: "input",
        hint: {
          en_US: "URL path parameter: attendee_id",
          zh_Hans: "URL 路径参数：attendee_id",
        },
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"attendee_id">,
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
    {
      name: "body_json",
      type: "string",
      required: false,
      display_name: {
        en_US: "Body",
        zh_Hans: "请求体",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "HTTP body object as JSON string (optional)",
          zh_Hans: "HTTP 请求体，JSON 对象字符串（可选）",
        },
        placeholder: {
          en_US: '{"key":"value"}',
          zh_Hans: '{"key":"value"}',
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>;
    const credentialId = readRequiredStringParam(p, "credential_id");
    const pathParams = {
      calendar_id: readRequiredStringParam(p, "calendar_id"),
      event_id: readRequiredStringParam(p, "event_id"),
      attendee_id: readRequiredStringParam(p, "attendee_id"),
    };
    const queryRaw = parseOptionalJsonObject(
      p.query_params_json,
      "query_params_json",
    );
    const query = parseCalendarActionQuery(queryRaw);
    const body = parseCalendarEmptyBody({});
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams: query,
      body,
    });
  },
};
