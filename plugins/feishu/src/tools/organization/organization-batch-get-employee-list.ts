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
import { parseOrganizationBatchGetEmployeeListQuery } from "./organization.zod"
import organization_batch_get_employee_listSkill from "./organization-batch-get-employee-list-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "organization_batch_get_employee_list",
  module: "organization",
  name: "批量查询员工列表",
  method: "POST",
  path: "/open-apis/directory/v1/employees/filter",
}

export const feishuOrganizationBatchGetEmployeeListTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Batch query employee list",
    zh_Hans: "批量查询员工列表",
  },
  description: {
    en_US:
      "This API is used to batch query employee detail lists that match specified conditions.",
    zh_Hans: "本接口用于依据指定条件，批量获取符合条件的员工详情列表。",
  },
  skill: organization_batch_get_employee_listSkill,
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
          en_US: "Employee filter payload JSON",
          zh_Hans: "员工筛选请求体 JSON",
        },
        placeholder: {
          en_US:
            '{"filter":{"conditions":[{"field":"employment_status","operator":"eq","value":"active"}]},"page_request":{"page_size":20}}',
          zh_Hans:
            '{"filter":{"conditions":[{"field":"employment_status","operator":"eq","value":"active"}]},"page_request":{"page_size":20}}',
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseOrganizationBatchGetEmployeeListQuery(
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
