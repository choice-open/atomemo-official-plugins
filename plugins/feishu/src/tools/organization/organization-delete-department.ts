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
import { parseOrganizationDeleteDepartmentQuery } from "./organization.zod"
import organization_delete_departmentSkill from "./organization-delete-department-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "organization_delete_department",
  module: "organization",
  name: "删除部门",
  method: "DELETE",
  path: "/open-apis/directory/v1/departments/:department_id",
}

export const feishuOrganizationDeleteDepartmentTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Delete department",
    zh_Hans: "删除部门",
  },
  description: {
    en_US: "This API is used to delete a department.",
    zh_Hans: "本接口用于删除部门。",
  },
  skill: organization_delete_departmentSkill,
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
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryParams = parseOrganizationDeleteDepartmentQuery(
      parseOptionalJsonObject(p.query_params_json, "query_params_json"),
    )
    const body = {}
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: {
        department_id: readRequiredStringParam(p, "department_id"),
      },
      queryParams,
      body,
    })
  },
}
