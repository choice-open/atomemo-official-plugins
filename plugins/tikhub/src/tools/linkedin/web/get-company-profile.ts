import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "get_company_profile",
  method: "GET",
  path: "/api/v1/linkedin/web/get_company_profile",
}

export const tikhub_linkedin_get_company_profile: ToolDefinition = {
  name: "tikhub_linkedin_get_company_profile",
  display_name: {
    en_US: "LinkedIn · Get Company Profile",
    zh_Hans: "LinkedIn · 获取公司资料",
  },
  description: {
    en_US: "Get LinkedIn company profile by company name or company ID.",
    zh_Hans: "通过公司名称或公司 ID 获取 LinkedIn 公司资料。",
  },
  icon: "💼",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "tikhub-api-key",
      display_name: { en_US: "Credential", zh_Hans: "凭证" },
      ui: { component: "credential-select" },
    },
    {
      name: "company",
      type: "string",
      required: false,
      display_name: { en_US: "Company Name", zh_Hans: "公司名称" },
      ai: {
        llm_description: {
          en_US: "Company name to look up. Provide either company name or company_id.",
          zh_Hans: "要查找的公司名称。提供 company 或 company_id 之一即可。",
        },
      },
      ui: { hint: { en_US: "Company name, e.g. Google.", zh_Hans: "公司名称，如 Google。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. Google", zh_Hans: "如：Google" }, width: "full" },
    },
    {
      name: "company_id",
      type: "string",
      required: false,
      display_name: { en_US: "Company ID", zh_Hans: "公司ID" },
      ai: {
        llm_description: {
          en_US: "LinkedIn company ID. Costs 1 extra request compared to searching by name.",
          zh_Hans: "LinkedIn 公司 ID。相比按名称搜索额外消耗 1 次请求。",
        },
      },
      ui: { hint: { en_US: "LinkedIn company ID. Costs +1 request.", zh_Hans: "LinkedIn 公司 ID，额外消耗 1 次请求。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. 1441", zh_Hans: "如：1441" } },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: {
        company: typeof p.company === "string" ? p.company : undefined,
        company_id: typeof p.company_id === "string" ? p.company_id : undefined,
      },
    })
  },
}
