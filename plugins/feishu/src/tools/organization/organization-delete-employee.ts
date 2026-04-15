import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../i18n/i18n-node";
import {
  invokeFeishuOpenApi,
  readRequiredStringParam,
} from "../feishu/request";
import type { FeishuApiFunction } from "../feishu-api-functions";
import { buildOrganizationQueryParams } from "./organization-query-build";
import { parseOrganizationDeleteEmployeeQuery } from "./organization.zod";
import organization_delete_employeeSkill from "./organization-delete-employee-skill.md" with { type: "text" };

const fn: FeishuApiFunction = {
  id: "organization_delete_employee",
  module: "organization",
  name: "离职员工",
  method: "DELETE",
  path: "/open-apis/directory/v1/employees/:employee_id",
};

export const feishuOrganizationDeleteEmployeeTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Terminate employee",
    zh_Hans: "离职员工",
  },
  description: {
    en_US: "This API is used to terminate an employee.",
    zh_Hans: "本接口用于离职员工。",
  },
  skill: organization_delete_employeeSkill,
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
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>;
    const credentialId = readRequiredStringParam(p, "credential_id");
    const queryParams = parseOrganizationDeleteEmployeeQuery(
      buildOrganizationQueryParams(p),
    );
    const body = {};
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: { employee_id: readRequiredStringParam(p, "employee_id") },
      queryParams,
      body,
    });
  },
};
