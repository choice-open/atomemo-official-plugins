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
import { parseOrganizationCreateEmployeeQuery } from "./organization.zod"
import organization_create_employeeSkill from "./organization-create-employee-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "organization_create_employee",
  module: "organization",
  name: "创建员工",
  method: "POST",
  path: "/open-apis/directory/v1/employees",
}

export const feishuOrganizationCreateEmployeeTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Create employee",
    zh_Hans: "创建员工",
  },
  description: {
    en_US: "This API is used to create an employee in the enterprise.",
    zh_Hans: "本接口用于在企业下创建员工。",
  },
  skill: organization_create_employeeSkill,
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
        placeholder: { en_US: "{}", zh_Hans: "{}" },
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
          en_US: "Employee payload JSON",
          zh_Hans: "员工创建请求体 JSON",
        },
        placeholder: { en_US: '{"name":"张三"}', zh_Hans: '{"name":"张三"}' },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"body_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const queryRaw = parseOptionalJsonObject(
      p.query_params_json,
      "query_params_json",
    )
    const bodyRaw = parseOptionalJsonObject(
      readRequiredStringParam(p, "body_json"),
      "body_json",
    )
    const queryParams = parseOrganizationCreateEmployeeQuery(queryRaw)
    const body = bodyRaw
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams: {},
      queryParams,
      body,
    })
  },
}
