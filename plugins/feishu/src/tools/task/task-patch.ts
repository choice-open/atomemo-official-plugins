import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  invokeFeishuOpenApi,
  parseOptionalJsonObject,
  readRequiredStringParam,
} from "../feishu/request"
import { t } from "../i18n/i18n-node"
import type { FeishuApiFunction } from "../feishu-api-functions"
import { parseTaskPatchBody, parseTaskPatchQuery } from "./zod/task-actions.zod"

import task_patchSkill from "./task-patch-skill.md" with { type: "text" }

const fn: FeishuApiFunction = {
  id: "task_patch",
  legacy_id: "f063",
  module: "task",
  name: "更新任务",
  method: "PATCH",
  path: "/open-apis/task/v2/tasks/:task_guid",
}

export const feishuTaskPatchTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: `[${fn.module}] ${fn.name}`,
    zh_Hans: `[${fn.module}] ${fn.name}`,
  },
  description: {
    en_US: `${fn.method} ${fn.path} (${fn.id}, legacy: ${fn.legacy_id})`,
    zh_Hans: `${fn.method} ${fn.path}（${fn.id}，兼容: ${fn.legacy_id}）`,
  },
  skill: task_patchSkill,
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
      name: "task_guid",
      type: "string",
      required: true,
      display_name: t("TASK_GUID"),
      ui: {
        component: "input",
        hint: t("TASK_GUID_HINT"),
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"task_guid">,
    {
      name: "query_params_json",
      type: "string",
      required: false,
      display_name: t("QUERY_PARAMS"),
      ui: {
        component: "input",
        hint: t("QUERY_PARAMS_HINT"),
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
      display_name: t("BODY"),
      ui: {
        component: "input",
        hint: t("BODY_HINT"),
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
    const queryRaw = parseOptionalJsonObject(
      p.query_params_json,
      "query_params_json",
    )
    const bodyRaw = parseOptionalJsonObject(p.body_json, "body_json")
    const query = parseTaskPatchQuery(queryRaw)
    const body = parseTaskPatchBody(bodyRaw)
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams: query,
      body,
    })
  },
}
