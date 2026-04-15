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
import { buildOrganizationQueryParams } from "./organization-query-build"
import { parseOrganizationListDepartmentsQuery } from "./organization.zod"
import organization_list_departmentsSkill from "./organization-list-departments-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "organization_list_departments",
  module: "organization",
  name: "获取部门列表",
  method: "POST",
  path: "/open-apis/directory/v1/departments/filter",
}

export const feishuOrganizationListDepartmentsTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "List department",
    zh_Hans: "获取部门列表",
  },
  description: {
    en_US:
      "This API is used to batch query department detail lists that match specified conditions.",
    zh_Hans: "本接口用于依据指定条件，批量获取符合条件的部门详情列表。",
  },
  skill: organization_list_departmentsSkill,
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
      name: "employee_id_type",
      type: "string",
      required: false,
      display_name: { en_US: "Employee ID Type", zh_Hans: "员工 ID 类型" },
      ui: {
        component: "input",
        placeholder: {
          en_US: "open_id | employee_id | union_id",
          zh_Hans: "open_id | employee_id | union_id",
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"employee_id_type">,
    {
      name: "department_id_type",
      type: "string",
      required: false,
      display_name: { en_US: "Department ID Type", zh_Hans: "部门 ID 类型" },
      ui: {
        component: "input",
        placeholder: {
          en_US: "open_department_id | department_id",
          zh_Hans: "open_department_id | department_id",
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"department_id_type">,
    {
      name: "body_json",
      type: "string",
      required: true,
      display_name: t("BODY"),
      ui: {
        component: "code-editor",
        hint: {
          en_US: "Department filter payload JSON",
          zh_Hans: "部门过滤请求体 JSON",
        },
        placeholder: {
          en_US:
            '{"filter":{"parent_department_ids":["0"]},"page_request":{"page_size":20}}',
          zh_Hans:
            '{"filter":{"parent_department_ids":["0"]},"page_request":{"page_size":20}}',
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseOrganizationListDepartmentsQuery(
      buildOrganizationQueryParams(p),
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
