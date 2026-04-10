import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  invokeFeishuOpenApi,
  parseOptionalJsonObject,
  readRequiredStringParam,
} from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import {
  parseTaskCreateSubtaskBody,
  parseTaskCreateSubtaskQuery,
} from "./zod/task-actions.zod"

const fn: FeishuApiFunction = {
  id: "task_create_subtask",
  legacy_id: "f069",
  module: "task",
  name: "创建子任务",
  method: "POST",
  path: "/open-apis/task/v2/tasks/:task_guid/subtasks",
}

export const feishuTaskCreateSubtaskTool: ToolDefinition = {
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
      name: "task_guid",
      type: "string",
      required: true,
      display_name: { en_US: "task_guid", zh_Hans: "task_guid" },
      ui: {
        component: "input",
        hint: {
          en_US: "URL path parameter: task_guid",
          zh_Hans: "URL 路径参数：task_guid",
        },
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"task_guid">,
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
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const pathParams = {
      task_guid: readRequiredStringParam(p, "task_guid"),
    }
    const queryRaw = parseOptionalJsonObject(p.query_params_json, "query_params_json")
    const bodyRaw = parseOptionalJsonObject(p.body_json, "body_json")
    const query = parseTaskCreateSubtaskQuery(queryRaw)
    const body = parseTaskCreateSubtaskBody(bodyRaw)
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams: query,
      body,
    })
  },
}
