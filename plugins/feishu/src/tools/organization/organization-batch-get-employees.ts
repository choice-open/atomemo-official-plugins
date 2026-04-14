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
import { parseOrganizationBatchGetEmployeesQuery } from "./organization.zod"
import organization_batch_get_employeesSkill from "./organization-batch-get-employees-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "organization_batch_get_employees",
  module: "organization",
  name: "批量获取员工信息",
  method: "POST",
  path: "/open-apis/directory/v1/employees/mget",
}

export const feishuOrganizationBatchGetEmployeesTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Batch get employee information",
    zh_Hans: "批量获取员工信息",
  },
  description: {
    en_US: "This API is used to batch query employee details by employee IDs.",
    zh_Hans: "本接口用于批量根据员工的ID查询员工的详情。",
  },
  skill: organization_batch_get_employeesSkill,
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
      ui: { component: "code-editor", width: "full", support_expression: true },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseOrganizationBatchGetEmployeesQuery(
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
