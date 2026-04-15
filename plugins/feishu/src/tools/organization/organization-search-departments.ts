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
import { parseOrganizationSearchDepartmentsQuery } from "./organization.zod"
import organization_search_departmentsSkill from "./organization-search-departments-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "organization_search_departments",
  module: "organization",
  name: "搜索部门",
  method: "POST",
  path: "/open-apis/directory/v1/departments/search",
}

export const feishuOrganizationSearchDepartmentsTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Search department",
    zh_Hans: "搜索部门",
  },
  description: {
    en_US:
      "This API is used to search department information and return departments matching keywords such as department names.",
    zh_Hans:
      "本接口用于搜索部门信息，通过部门名称等关键词搜索部门信息，返回符合条件的部门列表。",
  },
  skill: organization_search_departmentsSkill,
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
      ui: { component: "code-editor", width: "full", support_expression: true },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseOrganizationSearchDepartmentsQuery(
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
