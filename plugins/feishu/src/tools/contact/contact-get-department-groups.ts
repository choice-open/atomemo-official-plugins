import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import {
  invokeFeishuOpenApi,
  parseOptionalJsonObject,
  readRequiredStringParam,
} from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import {
  parseContactGetDepartmentGroupsBody,
  parseContactGetDepartmentGroupsQuery,
} from "./contact-get-department-groups.zod"

import contact_get_department_groupsSkill from "./contact-get-department-groups-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "contact_get_department_groups",
  legacy_id: "f022",
  module: "contact",
  name: "获取部门群",
  method: "GET",
  path: "/open-apis/contact/v3/departments/:department_id/groups",
}

export const feishuContactGetDepartmentGroupsTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: `[${fn.module}] ${fn.name}`,
    zh_Hans: `[${fn.module}] ${fn.name}`,
  },
  description: {
    en_US: `${fn.method} ${fn.path} (${fn.id}, legacy: ${fn.legacy_id})`,
    zh_Hans: `${fn.method} ${fn.path}（${fn.id}，兼容: ${fn.legacy_id}）`,
  },
  skill: contact_get_department_groupsSkill,
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
      display_name: t("DEPARTMENT_ID"),
      ui: {
        component: "input",
        hint: t("DEPARTMENT_ID_HINT"),
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"department_id">,
    {
      name: "query_params_json",
      type: "string",
      required: false,
      display_name: t("QUERY_PARAMS"),
      ui: {
        component: "input",
        hint: t("QUERY_PARAMS_HINT"),
        placeholder: { en_US: '{"page_size":20}', zh_Hans: '{"page_size":20}' },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"query_params_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const pathParams = {
      department_id: readRequiredStringParam(p, "department_id"),
    }
    const queryRaw = parseOptionalJsonObject(
      p.query_params_json,
      "query_params_json",
    )
    const query = parseContactGetDepartmentGroupsQuery(queryRaw)
    const body = parseContactGetDepartmentGroupsBody({})
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams: query,
      body,
    })
  },
}
