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
import { parseOrganizationCreateDepartmentQuery } from "./organization.zod"
import organization_create_departmentSkill from "./organization-create-department-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "organization_create_department",
  module: "organization",
  name: "创建部门",
  method: "POST",
  path: "/open-apis/directory/v1/departments",
}

export const feishuOrganizationCreateDepartmentTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Create department",
    zh_Hans: "创建部门",
  },
  description: {
    en_US: "This API is used to create a department in the enterprise.",
    zh_Hans: "本接口用于在企业下创建部门。",
  },
  skill: organization_create_departmentSkill,
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
    const queryParams = parseOrganizationCreateDepartmentQuery(
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
