import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { invokeFeishuOpenApi, readRequiredStringParam } from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import {
  parseCalendarBatchGetPrimaryQueryParams,
  parseCalendarBatchGetPrimaryBody,
} from "./zod/calendar-batch-get-primary.zod"

const fn: FeishuApiFunction = {
  id: "calendar_batch_get_primary",
  legacy_id: "f040",
  module: "calendar",
  name: "批量获取主日历信息",
  method: "POST",
  path: "/open-apis/calendar/v4/calendars/primary/batch_get",
}

export const feishuCalendarBatchGetPrimaryTool: ToolDefinition = {
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
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const pathParams = {}
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams: parseCalendarBatchGetPrimaryQueryParams(
        p.query_params_json,
        "query_params_json",
      ),
      body: parseCalendarBatchGetPrimaryBody(p.body_json, "body_json"),
    })
  },
}
