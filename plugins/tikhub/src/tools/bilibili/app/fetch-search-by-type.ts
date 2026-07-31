import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  bilibiliIntegerParameter,
  bilibiliSelectParameter,
  bilibiliStringParameter,
  credentialParameter,
  invokeBilibiliGet,
  readOptionalTrimmed,
  readPageSize,
  readSearchOrder,
  readSearchType,
  readTrimmedRequired,
  searchTypeValues,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "bilibili_app_fetch_search_by_type",
  method: "GET",
  path: "/api/v1/bilibili/app/fetch_search_by_type",
}

export const tikhub_bilibili_search_by_type: ToolDefinition = {
  name: "tikhub_bilibili_search_by_type",
  display_name: {
    en_US: "Bilibili · Search By Type",
    zh_Hans: "哔哩哔哩 · 分类搜索",
  },
  description: {
    en_US: "Search Bilibili videos, articles, users, and other result types.",
    zh_Hans: "按类型搜索 Bilibili 视频、专栏、用户等结果。",
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
        en_US: "Required keyword for Bilibili typed search.",
        zh_Hans: "Bilibili 分类搜索的必填关键词。",
      },
      placeholder: { en_US: "AI tools", zh_Hans: "AI 工具" },
    }),
    bilibiliSelectParameter({
      name: "search_type",
      values: searchTypeValues,
      default: "video",
      displayName: { en_US: "Search Type", zh_Hans: "搜索类型" },
      hint: {
        en_US:
          "OpenAPI default video. Supports video, bangumi, pgc, live, article, and user.",
        zh_Hans:
          "OpenAPI 默认 video。支持 video、bangumi、pgc、live、article、user。",
      },
      llmDescription: {
        en_US:
          "Typed search category. Use video for videos, article for columns, user for accounts, live only for search metadata.",
        zh_Hans:
          "分类搜索类型。video 搜视频，article 搜专栏，user 搜账号；live 本期只返回搜索元数据。",
      },
    }),
    bilibiliStringParameter({
      name: "cursor",
      default: "",
      displayName: { en_US: "Cursor", zh_Hans: "分页 cursor" },
      hint: {
        en_US:
          "Leave empty for the first page. For next pages, pass data.pagination.next unchanged.",
        zh_Hans: "首页留空。翻页时将响应 data.pagination.next 原样传回。",
      },
      llmDescription: {
        en_US:
          "Opaque pagination cursor. Do not parse, decode, rewrite, or synthesize it.",
        zh_Hans: "不透明分页 cursor。不要解析、解码、改写或自行生成。",
      },
    }),
    bilibiliIntegerParameter({
      name: "page_size",
      default: 20,
      displayName: { en_US: "Page Size", zh_Hans: "每页数量" },
      hint: {
        en_US: "OpenAPI default 20.",
        zh_Hans: "OpenAPI 默认 20。",
      },
      llmDescription: {
        en_US: "Number of search results per page. OpenAPI default is 20.",
        zh_Hans: "每页搜索结果数量。OpenAPI 默认 20。",
      },
    }),
    bilibiliIntegerParameter({
      name: "order",
      default: 0,
      enum: [0, 1, 2, 3],
      displayName: { en_US: "Order", zh_Hans: "排序方式" },
      hint: {
        en_US:
          "OpenAPI default 0. 0=comprehensive, 1=latest, 2=views, 3=danmaku count.",
        zh_Hans: "OpenAPI 默认 0。0 综合，1 最新，2 播放量，3 弹幕数。",
      },
      llmDescription: {
        en_US:
          "Search sort order. Allowed values are 0, 1, 2, and 3; send as the OpenAPI integer order query parameter.",
        zh_Hans:
          "搜索排序方式。只允许 0、1、2、3，并作为 OpenAPI integer order 查询参数发送。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeBilibiliGet(endpoint, args, {
      keyword: readTrimmedRequired(p, "keyword", "keyword"),
      search_type: readSearchType(p),
      cursor: readOptionalTrimmed(p, "cursor"),
      page_size: String(readPageSize(p)),
      order: String(readSearchOrder(p)),
    })
  },
}
