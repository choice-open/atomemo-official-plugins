import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "get_topic_feed",
  method: "GET",
  path: "/api/v1/xiaohongshu/app_v2/get_topic_feed",
}

export const tikhub_rednote_get_topic_feed: ToolDefinition = {
  name: "tikhub_rednote_get_topic_feed",
  display_name: {
    en_US: "RedNote · Get Topic Feed",
    zh_Hans: "小红书 · 获取话题笔记列表",
  },
  description: {
    en_US: "Get note list of a Xiaohongshu topic by topic page ID.",
    zh_Hans: "通过话题页面 ID 获取小红书话题下的笔记列表。",
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
      name: "page_id",
      type: "string",
      required: true,
      display_name: { en_US: "Page ID", zh_Hans: "话题页面ID" },
      ai: {
        llm_description: {
          en_US: "Topic page ID.",
          zh_Hans: "话题页面ID。",
        },
      },
      ui: { hint: { en_US: "Topic page ID, can be extracted from topic URL.", zh_Hans: "话题页面 ID，可从话题链接中提取。" },  support_expression: true, component: "input", placeholder: { en_US: "Topic page ID", zh_Hans: "话题页面ID" }, width: "full" },
    },
    {
      name: "sort",
      type: "string",
      required: false,
      default: "trend",
      display_name: { en_US: "Sort", zh_Hans: "排序方式" },
      ai: {
        llm_description: {
          en_US: "Sort order. Must be one of: trend (hottest), time (latest).",
          zh_Hans: "排序方式。可选值：trend（最热），time（最新）。",
        },
      },
      ui: { hint: { en_US: "Sort order: \"trend\" = hottest, \"time\" = latest.", zh_Hans: "排序方式：\"trend\" = 最热，\"time\" = 最新。" },  support_expression: true, component: "select" },
      enum: ["trend", "time"],
    },
    {
      name: "cursor_score",
      type: "string",
      required: false,
      default: "",
      display_name: { en_US: "Cursor Score", zh_Hans: "分页游标分数" },
      ai: {
        llm_description: {
          en_US: "Pagination cursor score from previous page response.",
          zh_Hans: "上一页返回的分页游标分数。",
        },
      },
      ui: { hint: { en_US: "Pagination cursor score from previous page response.", zh_Hans: "翻页游标分数，从上页返回结果中提取。" },  support_expression: true, component: "input" },
    },
    {
      name: "last_note_id",
      type: "string",
      required: false,
      default: "",
      display_name: { en_US: "Last Note ID", zh_Hans: "上页最后笔记ID" },
      ai: {
        llm_description: {
          en_US: "Last note ID from previous page, for pagination.",
          zh_Hans: "上一页最后一条笔记ID，用于翻页。",
        },
      },
      ui: { hint: { en_US: "Last note ID from previous page, used for pagination.", zh_Hans: "上页最后一条笔记 ID，翻页时传入。" },  support_expression: true, component: "input" },
    },
    {
      name: "last_note_ct",
      type: "string",
      required: false,
      default: "",
      display_name: { en_US: "Last Note Create Time", zh_Hans: "上页最后笔记创建时间" },
      ai: {
        llm_description: {
          en_US: "Last note create time from previous page, for pagination.",
          zh_Hans: "上一页最后一条笔记创建时间，用于翻页。",
        },
      },
      ui: { hint: { en_US: "Last note create time from previous page, used for pagination.", zh_Hans: "上页最后一条笔记创建时间，翻页时传入。" },  support_expression: true, component: "input" },
    },
    {
      name: "session_id",
      type: "string",
      required: false,
      default: "",
      display_name: { en_US: "Session ID", zh_Hans: "会话ID" },
      ai: {
        llm_description: {
          en_US: "Session ID, keep consistent across pagination requests.",
          zh_Hans: "会话ID，翻页时保持一致。",
        },
      },
      ui: { hint: { en_US: "Session ID, keep consistent across pagination requests.", zh_Hans: "会话 ID，翻页时保持一致。" },  support_expression: true, component: "input" },
    },
    {
      name: "first_load_time",
      type: "string",
      required: false,
      default: "",
      display_name: { en_US: "First Load Time", zh_Hans: "首次加载时间戳" },
      ai: {
        llm_description: {
          en_US: "First load timestamp, keep consistent across pagination requests.",
          zh_Hans: "首次加载时间戳，翻页时保持一致。",
        },
      },
      ui: { hint: { en_US: "First load timestamp, keep consistent across pagination requests.", zh_Hans: "首次加载时间戳，翻页时保持一致。" },  support_expression: true, component: "input" },
    },
    {
      name: "source",
      type: "string",
      required: false,
      default: "normal",
      display_name: { en_US: "Source", zh_Hans: "来源" },
      ai: {
        llm_description: {
          en_US: "Source identifier.",
          zh_Hans: "来源标识。",
        },
      },
      ui: { hint: { en_US: "Source identifier. Usually not needed.", zh_Hans: "来源标识，通常无需填写。" },  support_expression: true, component: "input" },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const pageId = readRequiredStringParam(p, "page_id")
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: {
        page_id: pageId,
        sort: typeof p.sort === "string" ? p.sort : undefined,
        cursor_score: typeof p.cursor_score === "string" ? p.cursor_score : undefined,
        last_note_id: typeof p.last_note_id === "string" ? p.last_note_id : undefined,
        last_note_ct: typeof p.last_note_ct === "string" ? p.last_note_ct : undefined,
        session_id: typeof p.session_id === "string" ? p.session_id : undefined,
        first_load_time: typeof p.first_load_time === "string" ? p.first_load_time : undefined,
        source: typeof p.source === "string" ? p.source : undefined,
      },
    })
  },
}
