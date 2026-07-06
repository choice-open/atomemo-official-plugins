import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "search_notes",
  method: "GET",
  path: "/api/v1/xiaohongshu/app_v2/search_notes",
}

export const tikhub_rednote_search_notes: ToolDefinition = {
  name: "tikhub_rednote_search_notes",
  display_name: {
    en_US: "RedNote · Search Notes",
    zh_Hans: "小红书 · 搜索笔记",
  },
  description: {
    en_US: "Search Xiaohongshu notes by keyword with optional filters for type, time, and sorting.",
    zh_Hans: "通过关键词搜索小红书笔记，支持笔记类型、发布时间和排序方式筛选。",
  },
  icon: "📕",
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
          en_US: "Search keyword for Xiaohongshu notes.",
          zh_Hans: "小红书笔记搜索关键词。",
        },
      },
      ui: { hint: { en_US: "Search keyword for Xiaohongshu notes.", zh_Hans: "小红书笔记搜索关键词。" },  support_expression: true, component: "input", placeholder: { en_US: "Search keyword", zh_Hans: "搜索关键词" }, width: "full" },
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
          zh_Hans: "页码，从1开始。",
        },
      },
      ui: { hint: { en_US: "Page number, starting from 1.", zh_Hans: "页码，从 1 开始。" },  support_expression: true, component: "number-input" },
    },
    {
      name: "sort_type",
      type: "string",
      required: false,
      default: "general",
      display_name: { en_US: "Sort Type", zh_Hans: "排序方式" },
      ai: {
        llm_description: {
          en_US: 'Sort type. Must be one of: "general" (comprehensive, default), "time_descending" (latest), "popularity_descending" (most likes), "comment_descending" (most comments), "collect_descending" (most saves), "english_preferred" (English first).',
          zh_Hans: '排序方式。可选值："general"（综合排序，默认），"time_descending"（最新），"popularity_descending"（最多点赞），"comment_descending"（最多评论），"collect_descending"（最多收藏），"english_preferred"（英文优先）。',
        },
      },
      ui: { hint: { en_US: "Sort type for search results.", zh_Hans: "搜索结果排序方式。" }, support_expression: true, component: "select" },
      enum: ["general", "time_descending", "popularity_descending", "comment_descending", "collect_descending", "english_preferred"],
    },
    {
      name: "note_type",
      type: "string",
      required: false,
      default: "不限",
      display_name: { en_US: "Note Type", zh_Hans: "笔记类型" },
      ai: {
        llm_description: {
          en_US: "Note type filter. Must be one of: 不限 (all), 视频笔记 (video notes), 普通笔记 (image/text notes), 直播笔记 (live notes).",
          zh_Hans: "笔记类型筛选。可选值：不限，视频笔记，普通笔记，直播笔记。",
        },
      },
      ui: { hint: { en_US: "Filter by note type.", zh_Hans: "按笔记类型筛选。" },  support_expression: true, component: "select" },
      enum: ["不限", "视频笔记", "普通笔记", "直播笔记"],
    },
    {
      name: "time_filter",
      type: "string",
      required: false,
      default: "不限",
      display_name: { en_US: "Time Filter", zh_Hans: "发布时间筛选" },
      ai: {
        llm_description: {
          en_US: "Time filter. Must be one of: 不限 (any time), 一天内 (within 1 day), 一周内 (within 1 week), 半年内 (within 6 months).",
          zh_Hans: "发布时间筛选。可选值：不限，一天内，一周内，半年内。",
        },
      },
      ui: { hint: { en_US: "Filter by publish time range.", zh_Hans: "按发布时间范围筛选。" },  support_expression: true, component: "select" },
      enum: ["不限", "一天内", "一周内", "半年内"],
    },
    {
      name: "search_id",
      type: "string",
      required: false,
      display_name: { en_US: "Search ID", zh_Hans: "搜索ID" },
      ai: {
        llm_description: {
          en_US: "Search ID from the first search response, for pagination.",
          zh_Hans: "首次搜索返回的搜索ID，用于翻页。",
        },
      },
      ui: { hint: { en_US: "Search ID from the first search response, used for pagination.", zh_Hans: "首次搜索返回的搜索 ID，翻页时传入。" },  support_expression: true, component: "input" },
    },
    {
      name: "search_session_id",
      type: "string",
      required: false,
      display_name: { en_US: "Search Session ID", zh_Hans: "搜索会话ID" },
      ai: {
        llm_description: {
          en_US: "Search session ID from the first search response, for pagination.",
          zh_Hans: "首次搜索返回的搜索会话ID，用于翻页。",
        },
      },
      ui: { hint: { en_US: "Search session ID from the first search response, used for pagination.", zh_Hans: "首次搜索返回的会话 ID，翻页时传入。" },  support_expression: true, component: "input" },
    },
    {
      name: "source",
      type: "string",
      required: false,
      default: "explore_feed",
      display_name: { en_US: "Source", zh_Hans: "来源" },
      ai: {
        llm_description: {
          en_US: 'Source identifier. Default is "explore_feed". Do not change unless instructed.',
          zh_Hans: '来源标识。默认为 "explore_feed"，请勿随意修改。',
        },
      },
      ui: { hint: { en_US: "Source identifier. Usually not needed.", zh_Hans: "来源标识，通常无需填写。" },  support_expression: true, component: "input" },
    },
    {
      name: "ai_mode",
      type: "integer",
      required: false,
      default: 0,
      display_name: { en_US: "AI Mode", zh_Hans: "AI模式" },
      ai: {
        llm_description: {
          en_US: "AI mode: 0=off, 1=on.",
          zh_Hans: "AI模式：0=关闭，1=开启。",
        },
      },
      ui: { hint: { en_US: "0 = AI mode off, 1 = AI mode on.", zh_Hans: "0 = 关闭 AI 模式，1 = 开启 AI 模式。" },  support_expression: true, component: "number-input" },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const page = typeof p.page === "number" ? String(p.page) : undefined
    const ai_mode = typeof p.ai_mode === "number" ? String(p.ai_mode) : undefined
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: {
        keyword: typeof p.keyword === "string" ? p.keyword : undefined,
        page,
        sort_type: typeof p.sort_type === "string" ? p.sort_type : undefined,
        note_type: typeof p.note_type === "string" ? p.note_type : undefined,
        time_filter: typeof p.time_filter === "string" ? p.time_filter : undefined,
        search_id: typeof p.search_id === "string" ? p.search_id : undefined,
        search_session_id: typeof p.search_session_id === "string" ? p.search_session_id : undefined,
        source: typeof p.source === "string" ? p.source : undefined,
        ai_mode,
      },
    })
  },
}
