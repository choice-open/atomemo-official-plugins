import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import { t } from "../../i18n/i18n-node";
import {
  invokeFeishuOpenApi,
  parseOptionalJsonObject,
  readRequiredStringParam,
} from "../feishu/request";
import type { FeishuApiFunction } from "../feishu-api-functions";
import { buildOrganizationQueryParams } from "./organization-query-build";
import { parseOrganizationPatchDepartmentQuery } from "./organization.zod";
import organization_patch_departmentSkill from "./organization-patch-department-skill.md" with { type: "text" };

const fn: FeishuApiFunction = {
  id: "organization_patch_department",
  module: "organization",
  name: "更新部门",
  method: "PATCH",
  path: "/open-apis/directory/v1/departments/:department_id",
};

export const feishuOrganizationPatchDepartmentTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Update department",
    zh_Hans: "更新部门",
  },
  description: {
    en_US: "This API is used to update department information.",
    zh_Hans: "本接口用于更新部门信息。",
  },
  skill: organization_patch_departmentSkill,
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
      name: "department_id",
      type: "string",
      required: true,
      display_name: { en_US: "Department ID", zh_Hans: "部门ID" },
      ui: { component: "input", width: "full", support_expression: true },
    } satisfies Property<"department_id">,
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
    const p = (args.parameters ?? {}) as Record<string, unknown>;
    const credentialId = readRequiredStringParam(p, "credential_id");
    const queryParams = parseOrganizationPatchDepartmentQuery(
      buildOrganizationQueryParams(p),
    );
    const body = parseOptionalJsonObject(
      readRequiredStringParam(p, "body_json"),
      "body_json",
    );
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: {
        department_id: readRequiredStringParam(p, "department_id"),
      },
      queryParams,
      body,
    });
  },
};
