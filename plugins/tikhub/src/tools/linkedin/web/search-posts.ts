import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "search_posts",
  method: "GET",
  path: "/api/v1/linkedin/web/search_posts",
}

export const tikhub_linkedin_search_posts: ToolDefinition = {
  name: "tikhub_linkedin_search_posts",
  display_name: {
    en_US: "LinkedIn · Search Posts",
    zh_Hans: "LinkedIn · 搜索帖子",
  },
  description: {
    en_US: "Search LinkedIn posts by keyword with optional filters for date, sort, author, company, and content type.",
    zh_Hans: "通过关键词搜索 LinkedIn 帖子，支持按发布时间、排序、作者、公司、内容类型等筛选。",
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
      name: "keyword",
      type: "string",
      required: true,
      display_name: { en_US: "Keyword", zh_Hans: "搜索关键词" },
      ai: {
        llm_description: {
          en_US: "Search keyword for LinkedIn posts.",
          zh_Hans: "LinkedIn 帖子搜索关键词。",
        },
      },
      ui: { hint: { en_US: "Search keyword for LinkedIn posts.", zh_Hans: "LinkedIn 帖子搜索关键词。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. AI trends", zh_Hans: "如：AI趋势" }, width: "full" },
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
      name: "date_posted",
      type: "string",
      required: false,
      display_name: { en_US: "Date Posted", zh_Hans: "发布时间" },
      ai: {
        llm_description: {
          en_US: "Filter by post date. Must be one of: past_month, past_week, past_24h.",
          zh_Hans: "按发布时间筛选。可选值：past_month（过去一个月），past_week（过去一周），past_24h（过去24小时）。",
        },
      },
      ui: { hint: { en_US: "past_month / past_week / past_24h", zh_Hans: "past_month / past_week / past_24h" }, support_expression: true, component: "select" },
      enum: ["past_month", "past_week", "past_24h"],
    },
    {
      name: "sort_by",
      type: "string",
      required: false,
      display_name: { en_US: "Sort By", zh_Hans: "排序方式" },
      ai: {
        llm_description: {
          en_US: "Sort order. Must be one of: date_posted (latest), relevance (most relevant).",
          zh_Hans: "排序方式。可选值：date_posted（最新），relevance（最相关）。",
        },
      },
      ui: { hint: { en_US: "date_posted = latest, relevance = most relevant.", zh_Hans: "date_posted = 最新，relevance = 最相关。" }, support_expression: true, component: "select" },
      enum: ["date_posted", "relevance"],
    },
    {
      name: "from_member",
      type: "string",
      required: false,
      display_name: { en_US: "From Member", zh_Hans: "按成员过滤" },
      ai: {
        llm_description: {
          en_US: "Filter by member, separate multiple values by comma.",
          zh_Hans: "按成员过滤，多个值用逗号分隔。",
        },
      },
      ui: { hint: { en_US: "Filter by member, comma-separated.", zh_Hans: "按成员过滤，逗号分隔。" }, support_expression: true, component: "input", placeholder: { en_US: "member1,member2", zh_Hans: "成员1,成员2" } },
    },
    {
      name: "from_company",
      type: "string",
      required: false,
      display_name: { en_US: "From Company", zh_Hans: "按公司过滤" },
      ai: {
        llm_description: {
          en_US: "Filter by company, separate multiple values by comma.",
          zh_Hans: "按公司过滤，多个值用逗号分隔。",
        },
      },
      ui: { hint: { en_US: "Filter by company, comma-separated.", zh_Hans: "按公司过滤，逗号分隔。" }, support_expression: true, component: "input", placeholder: { en_US: "company1,company2", zh_Hans: "公司1,公司2" } },
    },
    {
      name: "content_type",
      type: "string",
      required: false,
      display_name: { en_US: "Content Type", zh_Hans: "内容类型" },
      ai: {
        llm_description: {
          en_US: "Filter by content type. Must be one of: videos, photos, jobs, live_videos, documents, collaborative_articles.",
          zh_Hans: "按内容类型筛选。可选值：videos（视频），photos（图片），jobs（职位），live_videos（直播视频），documents（文档），collaborative_articles（协作文章）。",
        },
      },
      ui: { hint: { en_US: "videos / photos / jobs / live_videos / documents / collaborative_articles", zh_Hans: "videos / photos / jobs / live_videos / documents / collaborative_articles" }, support_expression: true, component: "select" },
      enum: ["videos", "photos", "jobs", "live_videos", "documents", "collaborative_articles"],
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
        keyword: typeof p.keyword === "string" ? p.keyword : undefined,
        page,
        date_posted: typeof p.date_posted === "string" ? p.date_posted : undefined,
        sort_by: typeof p.sort_by === "string" ? p.sort_by : undefined,
        from_member: typeof p.from_member === "string" ? p.from_member : undefined,
        from_company: typeof p.from_company === "string" ? p.from_company : undefined,
        content_type: typeof p.content_type === "string" ? p.content_type : undefined,
      },
    })
  },
}
