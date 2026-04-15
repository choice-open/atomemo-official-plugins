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
import { parseOrganizationPatchEmployeeQuery } from "./organization.zod"
import organization_patch_employeeSkill from "./organization-patch-employee-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "organization_patch_employee",
  module: "organization",
  name: "更新员工信息",
  method: "PATCH",
  path: "/open-apis/directory/v1/employees/:employee_id",
}

export const feishuOrganizationPatchEmployeeTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Update employee",
    zh_Hans: "更新员工信息",
  },
  description: {
    en_US:
      "This API is used to update information of active/resigned employees, and freeze/restore employees.",
    zh_Hans: "本接口用于更新在职/离职员工的信息、冻结/恢复员工。",
  },
  skill: organization_patch_employeeSkill,
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
      name: "employee_id",
      type: "string",
      required: true,
      display_name: { en_US: "Employee ID", zh_Hans: "员工ID" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"employee_id">,
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
    const queryParams = parseOrganizationPatchEmployeeQuery(
      buildOrganizationQueryParams(p),
    )
    const body = parseOptionalJsonObject(
      readRequiredStringParam(p, "body_json"),
      "body_json",
    )
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: { employee_id: readRequiredStringParam(p, "employee_id") },
      queryParams,
      body,
    })
  },
}
