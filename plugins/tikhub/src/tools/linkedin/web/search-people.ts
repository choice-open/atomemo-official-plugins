import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "search_people",
  method: "GET",
  path: "/api/v1/linkedin/web/search_people",
}

export const tikhub_linkedin_search_people: ToolDefinition = {
  name: "tikhub_linkedin_search_people",
  display_name: {
    en_US: "LinkedIn · Search People",
    zh_Hans: "LinkedIn · 搜索用户",
  },
  description: {
    en_US: "Search LinkedIn people by keyword, name, title, company, school, location, and other filters.",
    zh_Hans: "通过关键词、姓名、职位、公司、学校、位置等筛选条件搜索 LinkedIn 用户。",
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
      name: "name",
      type: "string",
      required: false,
      display_name: { en_US: "Keyword", zh_Hans: "搜索关键词" },
      ai: {
        llm_description: {
          en_US: "General search keyword for searching people on LinkedIn.",
          zh_Hans: "在 LinkedIn 上搜索用户的关键词。",
        },
      },
      ui: { hint: { en_US: "General search keyword for LinkedIn people search.", zh_Hans: "LinkedIn 用户搜索关键词。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. Software Engineer", zh_Hans: "如：软件工程师" }, width: "full" },
    },
    {
      name: "first_name",
      type: "string",
      required: false,
      display_name: { en_US: "First Name", zh_Hans: "名" },
      ai: {
        llm_description: {
          en_US: "Filter by first name.",
          zh_Hans: "按名字筛选。",
        },
      },
      ui: { hint: { en_US: "Filter by first name.", zh_Hans: "按名字筛选。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. John", zh_Hans: "如：John" } },
    },
    {
      name: "last_name",
      type: "string",
      required: false,
      display_name: { en_US: "Last Name", zh_Hans: "姓" },
      ai: {
        llm_description: {
          en_US: "Filter by last name.",
          zh_Hans: "按姓氏筛选。",
        },
      },
      ui: { hint: { en_US: "Filter by last name.", zh_Hans: "按姓氏筛选。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. Smith", zh_Hans: "如：Smith" } },
    },
    {
      name: "title",
      type: "string",
      required: false,
      display_name: { en_US: "Title", zh_Hans: "职位" },
      ai: {
        llm_description: {
          en_US: "Filter by job title.",
          zh_Hans: "按职位筛选。",
        },
      },
      ui: { hint: { en_US: "Filter by job title.", zh_Hans: "按职位筛选。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. CEO", zh_Hans: "如：CEO" } },
    },
    {
      name: "company",
      type: "string",
      required: false,
      display_name: { en_US: "Company", zh_Hans: "公司" },
      ai: {
        llm_description: {
          en_US: "Filter by company name.",
          zh_Hans: "按公司名称筛选。",
        },
      },
      ui: { hint: { en_US: "Filter by company name.", zh_Hans: "按公司名称筛选。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. Google", zh_Hans: "如：Google" } },
    },
    {
      name: "school",
      type: "string",
      required: false,
      display_name: { en_US: "School", zh_Hans: "学校" },
      ai: {
        llm_description: {
          en_US: "Filter by school name.",
          zh_Hans: "按学校名称筛选。",
        },
      },
      ui: { hint: { en_US: "Filter by school name.", zh_Hans: "按学校名称筛选。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. Stanford", zh_Hans: "如：Stanford" } },
    },
    {
      name: "page",
      type: "integer",
      required: false,
      default: 1,
      display_name: { en_US: "Page", zh_Hans: "页码" },
      ai: {
        llm_description: {
          en_US: "Page number, starting from 1.",
          zh_Hans: "页码，从 1 开始。",
        },
      },
      ui: { hint: { en_US: "Page number, starting from 1.", zh_Hans: "页码，从 1 开始。" }, support_expression: true, component: "number-input" },
    },
    {
      name: "geocode_location",
      type: "string",
      required: false,
      display_name: { en_US: "Location Geocode", zh_Hans: "地理位置代码" },
      ai: {
        llm_description: {
          en_US: "Geocode for location filtering, e.g. 103644278 for United States.",
          zh_Hans: "地理位置代码，如 103644278 代表美国。",
        },
      },
      ui: { hint: { en_US: "Geocode for location, e.g. 103644278 (US).", zh_Hans: "地理位置代码，如 103644278（美国）。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. 103644278", zh_Hans: "如：103644278" } },
    },
    {
      name: "current_company",
      type: "string",
      required: false,
      display_name: { en_US: "Current Company ID", zh_Hans: "当前公司ID" },
      ai: {
        llm_description: {
          en_US: "Filter by current company ID.",
          zh_Hans: "按当前公司 ID 筛选。",
        },
      },
      ui: { hint: { en_US: "Filter by current company ID.", zh_Hans: "按当前公司 ID 筛选。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. 1441", zh_Hans: "如：1441" } },
    },
    {
      name: "profile_language",
      type: "string",
      required: false,
      display_name: { en_US: "Profile Language", zh_Hans: "个人资料语言" },
      ai: {
        llm_description: {
          en_US: "Filter by profile language.",
          zh_Hans: "按个人资料语言筛选。",
        },
      },
      ui: { hint: { en_US: "Filter by profile language code.", zh_Hans: "按个人资料语言代码筛选。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. en", zh_Hans: "如：en" } },
    },
    {
      name: "industry",
      type: "string",
      required: false,
      display_name: { en_US: "Industry ID", zh_Hans: "行业ID" },
      ai: {
        llm_description: {
          en_US: "Filter by industry ID.",
          zh_Hans: "按行业 ID 筛选。",
        },
      },
      ui: { hint: { en_US: "Filter by industry ID.", zh_Hans: "按行业 ID 筛选。" }, support_expression: true, component: "input", placeholder: { en_US: "Industry ID", zh_Hans: "行业ID" } },
    },
    {
      name: "service_category",
      type: "string",
      required: false,
      display_name: { en_US: "Service Category ID", zh_Hans: "服务类别ID" },
      ai: {
        llm_description: {
          en_US: "Filter by service category ID.",
          zh_Hans: "按服务类别 ID 筛选。",
        },
      },
      ui: { hint: { en_US: "Filter by service category ID.", zh_Hans: "按服务类别 ID 筛选。" }, support_expression: true, component: "input", placeholder: { en_US: "Service category ID", zh_Hans: "服务类别ID" } },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const page = typeof p.page === "number" ? String(p.page) : undefined
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: {
        name: typeof p.name === "string" ? p.name : undefined,
        first_name: typeof p.first_name === "string" ? p.first_name : undefined,
        last_name: typeof p.last_name === "string" ? p.last_name : undefined,
        title: typeof p.title === "string" ? p.title : undefined,
        company: typeof p.company === "string" ? p.company : undefined,
        school: typeof p.school === "string" ? p.school : undefined,
        page,
        geocode_location: typeof p.geocode_location === "string" ? p.geocode_location : undefined,
        current_company: typeof p.current_company === "string" ? p.current_company : undefined,
        profile_language: typeof p.profile_language === "string" ? p.profile_language : undefined,
        industry: typeof p.industry === "string" ? p.industry : undefined,
        service_category: typeof p.service_category === "string" ? p.service_category : undefined,
      },
    })
  },
}
