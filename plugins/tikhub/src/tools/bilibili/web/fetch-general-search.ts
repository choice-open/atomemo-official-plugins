import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  bilibiliIntegerParameter,
  bilibiliSelectParameter,
  bilibiliStringParameter,
  credentialParameter,
  generalSearchOrderValues,
  invokeBilibiliGet,
  readGeneralSearchDuration,
  readGeneralSearchOrder,
  readOptionalNonNegativeInteger,
  readRequiredIntegerParam,
  readTrimmedRequired,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "bilibili_web_fetch_general_search",
  method: "GET",
  path: "/api/v1/bilibili/web/fetch_general_search",
}

export const tikhub_bilibili_general_search: ToolDefinition = {
  name: "tikhub_bilibili_general_search",
  display_name: {
    en_US: "Bilibili · General Search",
    zh_Hans: "哔哩哔哩 · 综合搜索",
  },
  description: {
    en_US: "Search Bilibili Web video results by keyword and sorting filters.",
    zh_Hans: "通过 Bilibili Web 按关键词和排序筛选搜索视频结果。",
  },
  icon: "📺",
  parameters: [
    credentialParameter,
    bilibiliStringParameter({
      name: "keyword",
      required: true,
      displayName: { en_US: "Keyword", zh_Hans: "关键词" },
      hint: {
        en_US: "Required search keyword.",
        zh_Hans: "必填搜索关键词。",
      },
      llmDescription: {
        en_US:
          "Required keyword for Bilibili Web general search. Prefer this tool for video discovery because Web results can provide BV IDs for downstream video tools.",
        zh_Hans:
          "Bilibili Web 综合搜索的必填关键词。视频发现优先使用此工具，因为 Web 结果可提供下游视频工具需要的 BV 号。",
      },
      placeholder: { en_US: "AI tools", zh_Hans: "AI 工具" },
    }),
    bilibiliSelectParameter({
      name: "order",
      values: generalSearchOrderValues,
      required: true,
      displayName: { en_US: "Order", zh_Hans: "排序方式" },
      hint: {
        en_US:
          "Required. totalrank=comprehensive, click=views, pubdate=latest, dm=danmaku, stow=favorites.",
        zh_Hans:
          "必填。totalrank 综合，click 播放量，pubdate 最新，dm 弹幕，stow 收藏。",
      },
      llmDescription: {
        en_US:
          "General search sort order. Allowed values are totalrank, click, pubdate, dm, and stow.",
        zh_Hans:
          "综合搜索排序方式。只允许 totalrank、click、pubdate、dm、stow。",
      },
    }),
    bilibiliIntegerParameter({
      name: "page",
      required: true,
      minimum: 1,
      displayName: { en_US: "Page", zh_Hans: "页码" },
      hint: {
        en_US: "Required page number. Use 1 for the first page.",
        zh_Hans: "必填页码。第一页使用 1。",
      },
      llmDescription: {
        en_US: "Required general search page number. Use 1 for the first page.",
        zh_Hans: "必填综合搜索页码。第一页使用 1。",
      },
    }),
    bilibiliIntegerParameter({
      name: "page_size",
      required: true,
      minimum: 1,
      displayName: { en_US: "Page Size", zh_Hans: "每页数量" },
      hint: {
        en_US: "Required number of results per page. OpenAPI example uses 42.",
        zh_Hans: "必填每页结果数量。OpenAPI 示例使用 42。",
      },
      llmDescription: {
        en_US: "Required number of general search results per page.",
        zh_Hans: "必填综合搜索每页结果数量。",
      },
    }),
    bilibiliIntegerParameter({
      name: "duration",
      default: 0,
      enum: [0, 1, 2, 3, 4],
      displayName: { en_US: "Duration", zh_Hans: "时长筛选" },
      hint: {
        en_US:
          "OpenAPI default 0. 0=all, 1=under 10 min, 2=10-30 min, 3=30-60 min, 4=over 60 min.",
        zh_Hans:
          "OpenAPI 默认 0。0 全部，1 10 分钟以下，2 10-30 分钟，3 30-60 分钟，4 60 分钟以上。",
      },
      llmDescription: {
        en_US:
          "Optional duration filter. Allowed values are 0, 1, 2, 3, and 4.",
        zh_Hans: "可选时长筛选。只允许 0、1、2、3、4。",
      },
    }),
    bilibiliIntegerParameter({
      name: "pubtime_begin_s",
      default: 0,
      minimum: 0,
      displayName: { en_US: "Publish Start", zh_Hans: "发布开始时间" },
      hint: {
        en_US:
          "OpenAPI default 0. Optional 10-digit Unix timestamp, less than end timestamp.",
        zh_Hans: "OpenAPI 默认 0。可选 10 位 Unix 时间戳，需小于结束时间。",
      },
      llmDescription: {
        en_US:
          "Optional publish start timestamp in seconds. Use 0 when not filtering.",
        zh_Hans: "可选发布时间起始秒级时间戳。不筛选时使用 0。",
      },
    }),
    bilibiliIntegerParameter({
      name: "pubtime_end_s",
      default: 0,
      minimum: 0,
      displayName: { en_US: "Publish End", zh_Hans: "发布结束时间" },
      hint: {
        en_US:
          "OpenAPI default 0. Optional 10-digit Unix timestamp, greater than start timestamp.",
        zh_Hans: "OpenAPI 默认 0。可选 10 位 Unix 时间戳，需大于开始时间。",
      },
      llmDescription: {
        en_US:
          "Optional publish end timestamp in seconds. Use 0 when not filtering.",
        zh_Hans: "可选发布时间结束秒级时间戳。不筛选时使用 0。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const page = readRequiredIntegerParam(p, "page", "page")
    const pageSize = readRequiredIntegerParam(p, "page_size", "page_size")
    if (page < 1) {
      throw new Error("page must be greater than or equal to 1.")
    }
    if (pageSize < 1) {
      throw new Error("page_size must be greater than or equal to 1.")
    }
    return invokeBilibiliGet(endpoint, args, {
      keyword: readTrimmedRequired(p, "keyword", "keyword"),
      order: readGeneralSearchOrder(p),
      page: String(page),
      page_size: String(pageSize),
      duration: String(readGeneralSearchDuration(p)),
      pubtime_begin_s: String(
        readOptionalNonNegativeInteger(p, "pubtime_begin_s"),
      ),
      pubtime_end_s: String(readOptionalNonNegativeInteger(p, "pubtime_end_s")),
    })
  },
}
