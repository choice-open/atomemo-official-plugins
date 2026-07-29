import type {
  JsonValue,
  Property,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../lib/request"

export const credentialParameter = {
  name: "credential_id",
  type: "credential_id",
  required: true,
  credential_name: "tikhub-api-key",
  display_name: { en_US: "Credential", zh_Hans: "凭证" },
  ui: { component: "credential-select" },
} satisfies Property<"credential_id">

export const uploadDateValues = [
  "last_hour",
  "today",
  "this_week",
  "this_month",
  "this_year",
] as const

export const contentTypeValues = [
  "video",
  "channel",
  "playlist",
  "movie",
] as const

export const durationValues = ["short", "medium", "long"] as const

export const sortByValues = [
  "relevance",
  "upload_date",
  "view_count",
  "rating",
] as const

export const captionFormatValues = ["srt", "xml", "json3", "txt"] as const

export const commentSortValues = ["top", "newest"] as const

export const trendingSectionValues = [
  "Now",
  "Music",
  "Gaming",
  "Movies",
] as const

export function youtubeStringParameter<Name extends string>(options: {
  name: Name
  required?: boolean
  default?: string
  displayName: { en_US: string; zh_Hans: string }
  hint: { en_US: string; zh_Hans: string }
  llmDescription: { en_US: string; zh_Hans: string }
  placeholder?: { en_US: string; zh_Hans: string }
}): Property<Name> {
  return {
    name: options.name,
    type: "string",
    required: options.required ?? false,
    ...(options.default !== undefined ? { default: options.default } : {}),
    display_name: options.displayName,
    ai: { llm_description: options.llmDescription },
    ui: {
      component: "input",
      hint: options.hint,
      placeholder: options.placeholder,
      support_expression: true,
      width: "full",
    },
  }
}

export function youtubeSelectParameter<Name extends string>(options: {
  name: Name
  values: readonly string[]
  default?: string
  displayName: { en_US: string; zh_Hans: string }
  hint: { en_US: string; zh_Hans: string }
  llmDescription: { en_US: string; zh_Hans: string }
}): Property<Name> {
  return {
    name: options.name,
    type: "string",
    required: false,
    ...(options.default !== undefined ? { default: options.default } : {}),
    enum: [...options.values],
    display_name: options.displayName,
    ai: { llm_description: options.llmDescription },
    ui: {
      component: "select",
      hint: options.hint,
      support_expression: true,
      width: "full",
    },
  }
}

export function youtubeBooleanParameter<Name extends string>(options: {
  name: Name
  default: boolean
  displayName: { en_US: string; zh_Hans: string }
  hint: { en_US: string; zh_Hans: string }
  llmDescription: { en_US: string; zh_Hans: string }
}): Property<Name> {
  return {
    name: options.name,
    type: "boolean",
    required: false,
    default: options.default,
    display_name: options.displayName,
    ai: { llm_description: options.llmDescription },
    ui: {
      component: "switch",
      hint: options.hint,
      support_expression: true,
    },
  }
}

export const keywordParameter = youtubeStringParameter({
  name: "keyword",
  required: false,
  displayName: { en_US: "Keyword", zh_Hans: "关键词" },
  hint: {
    en_US:
      "Required on the first search request. For pagination, you may pass only the continuation token.",
    zh_Hans: "首次搜索必填。翻页时可只传 continuation token。",
  },
  llmDescription: {
    en_US:
      "YouTube search keyword. Required for the first page; when using a continuation_token, do not invent or rewrite the keyword.",
    zh_Hans:
      "YouTube 搜索关键词。第一页必填；使用 continuation_token 翻页时不要编造或改写关键词。",
  },
  placeholder: { en_US: "AI product review", zh_Hans: "AI 产品评测" },
})

export const continuationTokenParameter = youtubeStringParameter({
  name: "continuation_token",
  required: false,
  displayName: { en_US: "Continuation Token", zh_Hans: "分页 Token" },
  hint: {
    en_US: "Opaque token from the previous TikHub response. Pass it unchanged.",
    zh_Hans: "上一次 TikHub 响应返回的不透明 token，必须原样传入。",
  },
  llmDescription: {
    en_US:
      "Pagination continuation token. Treat it as an opaque string from the previous response; do not parse, decode, or modify it.",
    zh_Hans:
      "分页 continuation token。它是上次响应的不透明字符串，不要解析、解码或修改。",
  },
  placeholder: { en_US: "Leave empty for first page", zh_Hans: "首次请求留空" },
})

export const videoIdParameter = youtubeStringParameter({
  name: "video_id",
  required: false,
  displayName: { en_US: "Video ID", zh_Hans: "视频 ID" },
  hint: {
    en_US:
      "YouTube video ID as a string. When video_url is also provided, TikHub uses video_id first.",
    zh_Hans:
      "YouTube 视频 ID，字符串。与 video_url 同时提供时优先使用 video_id。",
  },
  llmDescription: {
    en_US:
      "YouTube video ID. Provide it as a string; it takes priority over video_url when both are present.",
    zh_Hans:
      "YouTube 视频 ID。请以字符串提供；与 video_url 同时存在时优先使用该值。",
  },
  placeholder: { en_US: "dQw4w9WgXcQ", zh_Hans: "dQw4w9WgXcQ" },
})

export const videoUrlParameter = youtubeStringParameter({
  name: "video_url",
  required: false,
  displayName: { en_US: "Video URL", zh_Hans: "视频 URL" },
  hint: {
    en_US:
      "Full YouTube URL. Used only when video_id is empty for endpoints that support both.",
    zh_Hans: "完整 YouTube 链接。仅在 video_id 为空时使用。",
  },
  llmDescription: {
    en_US:
      "Full YouTube video URL. At least one of video_id or video_url is required; video_id has priority if both are supplied.",
    zh_Hans:
      "完整 YouTube 视频链接。video_id 和 video_url 至少提供一个；同时提供时 video_id 优先。",
  },
  placeholder: {
    en_US: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    zh_Hans: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
})

export const channelIdParameter = youtubeStringParameter({
  name: "channel_id",
  required: true,
  displayName: { en_US: "Channel ID", zh_Hans: "频道 ID" },
  hint: {
    en_US: "YouTube channel ID as a string, for example UC...",
    zh_Hans: "YouTube 频道 ID，字符串，例如 UC...",
  },
  llmDescription: {
    en_US:
      "YouTube channel ID. Provide it as a string for channel profile and historical video analysis.",
    zh_Hans: "YouTube 频道 ID。用于频道画像和历史视频分析，请以字符串提供。",
  },
  placeholder: {
    en_US: "UC_x5XG1OV2P6uZZ5FSM9Ttw",
    zh_Hans: "UC_x5XG1OV2P6uZZ5FSM9Ttw",
  },
})

export const languageCodeZhParameter = youtubeStringParameter({
  name: "language_code",
  required: false,
  default: "zh-CN",
  displayName: { en_US: "Language Code", zh_Hans: "语言代码" },
  hint: {
    en_US: "Language code passed to YouTube, default zh-CN.",
    zh_Hans: "传给 YouTube 的语言代码，默认 zh-CN。",
  },
  llmDescription: {
    en_US: "Optional language code. TikHub default is zh-CN.",
    zh_Hans: "可选语言代码。TikHub 默认值为 zh-CN。",
  },
  placeholder: { en_US: "zh-CN", zh_Hans: "zh-CN" },
})

export const countryCodeUsParameter = youtubeStringParameter({
  name: "country_code",
  required: false,
  default: "US",
  displayName: { en_US: "Country Code", zh_Hans: "国家代码" },
  hint: {
    en_US: "Country code passed to YouTube, default US.",
    zh_Hans: "传给 YouTube 的国家代码，默认 US。",
  },
  llmDescription: {
    en_US: "Optional country code. TikHub default is US.",
    zh_Hans: "可选国家代码。TikHub 默认值为 US。",
  },
  placeholder: { en_US: "US", zh_Hans: "US" },
})

export const needFormatParameter = youtubeBooleanParameter({
  name: "need_format",
  default: true,
  displayName: { en_US: "Format Response", zh_Hans: "格式化结果" },
  hint: {
    en_US:
      "Default true. Keep enabled for structured workflow and LLM-friendly fields.",
    zh_Hans: "默认 true。建议保持开启，便于工作流和 LLM 使用结构化字段。",
  },
  llmDescription: {
    en_US:
      "Whether TikHub should return cleaned, formatted data. Default is true; set false only when raw TikHub data is required.",
    zh_Hans:
      "是否让 TikHub 返回清洗后的格式化数据。默认 true；只有需要原始 TikHub 数据时才关闭。",
  },
})

export function readOptionalStringParam(
  params: Record<string, unknown>,
  name: string,
): string | undefined {
  const value = params[name]
  if (typeof value !== "string") {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed === "" ? undefined : trimmed
}

export function readOptionalBooleanParam(
  params: Record<string, unknown>,
  name: string,
): string | undefined {
  const value = params[name]
  return typeof value === "boolean" ? String(value) : undefined
}

export function readVideoIdOrUrl(params: Record<string, unknown>): {
  video_id?: string
  video_url?: string
} {
  const videoId = readOptionalStringParam(params, "video_id")
  const videoUrl = readOptionalStringParam(params, "video_url")
  if (!videoId && !videoUrl) {
    throw new Error("Provide at least one of video_id or video_url.")
  }
  return { video_id: videoId, video_url: videoUrl }
}

export function readKeywordOrContinuation(params: Record<string, unknown>): {
  keyword?: string
  continuation_token?: string
} {
  const keyword = readOptionalStringParam(params, "keyword")
  const continuationToken = readOptionalStringParam(
    params,
    "continuation_token",
  )
  if (!keyword && !continuationToken) {
    throw new Error(
      "Provide keyword for the first request or continuation_token for pagination.",
    )
  }
  return { keyword, continuation_token: continuationToken }
}

export function invokeYouTubeGet(
  endpoint: TikHubApiEndpoint,
  args: { parameters?: unknown; credentials?: Record<string, unknown> },
  queryParams: Record<string, string | undefined>,
): Promise<JsonValue> {
  const params = (args.parameters ?? {}) as Record<string, unknown>
  return invokeTikHubApi(endpoint, {
    credentials: args.credentials,
    credentialId: readRequiredStringParam(params, "credential_id"),
    queryParams,
  })
}
