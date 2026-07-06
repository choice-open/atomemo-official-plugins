import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "get_user_profile",
  method: "GET",
  path: "/api/v1/linkedin/web/get_user_profile",
}

export const tikhub_linkedin_get_user_profile: ToolDefinition = {
  name: "tikhub_linkedin_get_user_profile",
  display_name: {
    en_US: "LinkedIn · Get User Profile",
    zh_Hans: "LinkedIn · 获取用户资料",
  },
  description: {
    en_US: "Get LinkedIn user profile by username, with optional flags to include detailed information (each flag costs 1 extra request).",
    zh_Hans: "通过用户名获取 LinkedIn 用户资料，支持通过可选参数包含更多详细信息（每个参数额外消耗 1 次请求）。",
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
      name: "username",
      type: "string",
      required: true,
      display_name: { en_US: "Username", zh_Hans: "用户名" },
      ai: {
        llm_description: {
          en_US: "LinkedIn username for the profile to fetch.",
          zh_Hans: "要获取资料的 LinkedIn 用户名。",
        },
      },
      ui: { hint: { en_US: "LinkedIn username, e.g. john-doe-123456.", zh_Hans: "LinkedIn 用户名，如 john-doe-123456。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. john-doe-123456", zh_Hans: "如：john-doe-123456" }, width: "full" },
    },
    {
      name: "include_follower_and_connection",
      type: "boolean",
      required: false,
      display_name: { en_US: "Include Followers & Connections", zh_Hans: "包含粉丝和连接数" },
      ai: {
        llm_description: {
          en_US: "Include follower and connection count. Costs 1 extra request.",
          zh_Hans: "包含粉丝和连接数，额外消耗 1 次请求。",
        },
      },
      ui: { hint: { en_US: "Costs +1 request.", zh_Hans: "额外消耗 1 次请求。" }, component: "switch" },
    },
    {
      name: "include_experiences",
      type: "boolean",
      required: false,
      display_name: { en_US: "Include Work Experiences", zh_Hans: "包含工作经历" },
      ai: {
        llm_description: {
          en_US: "Include work experiences. Costs 1 extra request.",
          zh_Hans: "包含工作经历，额外消耗 1 次请求。",
        },
      },
      ui: { hint: { en_US: "Costs +1 request.", zh_Hans: "额外消耗 1 次请求。" }, component: "switch" },
    },
    {
      name: "include_skills",
      type: "boolean",
      required: false,
      display_name: { en_US: "Include Skills", zh_Hans: "包含技能" },
      ai: {
        llm_description: {
          en_US: "Include skills. Costs 1 extra request.",
          zh_Hans: "包含技能，额外消耗 1 次请求。",
        },
      },
      ui: { hint: { en_US: "Costs +1 request.", zh_Hans: "额外消耗 1 次请求。" }, component: "switch" },
    },
    {
      name: "include_certifications",
      type: "boolean",
      required: false,
      display_name: { en_US: "Include Certifications", zh_Hans: "包含认证" },
      ai: {
        llm_description: {
          en_US: "Include certifications. Costs 1 extra request.",
          zh_Hans: "包含认证，额外消耗 1 次请求。",
        },
      },
      ui: { hint: { en_US: "Costs +1 request.", zh_Hans: "额外消耗 1 次请求。" }, component: "switch" },
    },
    {
      name: "include_publications",
      type: "boolean",
      required: false,
      display_name: { en_US: "Include Publications", zh_Hans: "包含出版物" },
      ai: {
        llm_description: {
          en_US: "Include publications. Costs 1 extra request.",
          zh_Hans: "包含出版物，额外消耗 1 次请求。",
        },
      },
      ui: { hint: { en_US: "Costs +1 request.", zh_Hans: "额外消耗 1 次请求。" }, component: "switch" },
    },
    {
      name: "include_educations",
      type: "boolean",
      required: false,
      display_name: { en_US: "Include Education", zh_Hans: "包含教育背景" },
      ai: {
        llm_description: {
          en_US: "Include educational background. Costs 1 extra request.",
          zh_Hans: "包含教育背景，额外消耗 1 次请求。",
        },
      },
      ui: { hint: { en_US: "Costs +1 request.", zh_Hans: "额外消耗 1 次请求。" }, component: "switch" },
    },
    {
      name: "include_volunteers",
      type: "boolean",
      required: false,
      display_name: { en_US: "Include Volunteer Experiences", zh_Hans: "包含志愿者经历" },
      ai: {
        llm_description: {
          en_US: "Include volunteer experiences. Costs 1 extra request.",
          zh_Hans: "包含志愿者经历，额外消耗 1 次请求。",
        },
      },
      ui: { hint: { en_US: "Costs +1 request.", zh_Hans: "额外消耗 1 次请求。" }, component: "switch" },
    },
    {
      name: "include_honors",
      type: "boolean",
      required: false,
      display_name: { en_US: "Include Honors & Awards", zh_Hans: "包含荣誉奖项" },
      ai: {
        llm_description: {
          en_US: "Include honors and awards. Costs 1 extra request.",
          zh_Hans: "包含荣誉奖项，额外消耗 1 次请求。",
        },
      },
      ui: { hint: { en_US: "Costs +1 request.", zh_Hans: "额外消耗 1 次请求。" }, component: "switch" },
    },
    {
      name: "include_interests",
      type: "boolean",
      required: false,
      display_name: { en_US: "Include Interests", zh_Hans: "包含兴趣" },
      ai: {
        llm_description: {
          en_US: "Include interests. Costs 1 extra request.",
          zh_Hans: "包含兴趣，额外消耗 1 次请求。",
        },
      },
      ui: { hint: { en_US: "Costs +1 request.", zh_Hans: "额外消耗 1 次请求。" }, component: "switch" },
    },
    {
      name: "include_bio",
      type: "boolean",
      required: false,
      display_name: { en_US: "Include Bio/About", zh_Hans: "包含个人简介" },
      ai: {
        llm_description: {
          en_US: "Include bio/about section. Costs 1 extra request.",
          zh_Hans: "包含个人简介，额外消耗 1 次请求。",
        },
      },
      ui: { hint: { en_US: "Costs +1 request.", zh_Hans: "额外消耗 1 次请求。" }, component: "switch" },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const toBoolStr = (v: unknown): string | undefined =>
      typeof v === "boolean" ? (v ? "true" : "false") : undefined
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: {
        username: typeof p.username === "string" ? p.username : undefined,
        include_follower_and_connection: toBoolStr(p.include_follower_and_connection),
        include_experiences: toBoolStr(p.include_experiences),
        include_skills: toBoolStr(p.include_skills),
        include_certifications: toBoolStr(p.include_certifications),
        include_publications: toBoolStr(p.include_publications),
        include_educations: toBoolStr(p.include_educations),
        include_volunteers: toBoolStr(p.include_volunteers),
        include_honors: toBoolStr(p.include_honors),
        include_interests: toBoolStr(p.include_interests),
        include_bio: toBoolStr(p.include_bio),
      },
    })
  },
}
