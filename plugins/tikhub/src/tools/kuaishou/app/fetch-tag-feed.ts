import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeKuaishouGet,
  kuaishouIntegerParameter,
  kuaishouSelectParameter,
  kuaishouStringParameter,
  pcursorParameter,
  readEnum,
  readInteger,
  readOpaqueCursor,
  readOptionalTrimmed,
  readRequiredString,
  tagTabValues,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "kuaishou_app_fetch_tag_feed",
  method: "GET",
  path: "/api/v1/kuaishou/app/fetch_tag_feed",
}

export const tikhub_kuaishou_tag_feed: ToolDefinition = {
  name: "tikhub_kuaishou_tag_feed",
  display_name: {
    en_US: "Kuaishou · Tag Feed",
    zh_Hans: "快手 · 话题聚合内容",
  },
  description: {
    en_US:
      "Fetch hot, latest, image, or live aggregation results for a Kuaishou tag. It does not fetch live streams or media files.",
    zh_Hans:
      "获取快手话题的热门、最新、图片或直播聚合结果；不获取直播流或媒体文件。",
  },
  icon: "🎬",
  parameters: [
    credentialParameter,
    kuaishouStringParameter({
      name: "general_tag_id",
      required: true,
      displayName: { en_US: "General Tag ID", zh_Hans: "标签 ID" },
      hint: {
        en_US:
          "Required. Use a topic name or numeric ID from tag search; sound tags use their encoded string.",
        zh_Hans:
          "必填。话题标签使用标签名或搜索返回的数字 ID；声音标签使用其编码串。",
      },
      llmDescription: {
        en_US:
          "Required tag identifier. Keep numeric and encoded identifiers as strings without rewriting them.",
        zh_Hans: "必填标签标识。数字或编码标识均按字符串原样保留。",
      },
      placeholder: { en_US: "AI or 123456", zh_Hans: "人工智能 或 123456" },
    }),
    kuaishouSelectParameter({
      name: "tab",
      values: tagTabValues,
      default: "hot",
      displayName: { en_US: "Tab", zh_Hans: "内容分类" },
      hint: {
        en_US: "OpenAPI default hot. live returns aggregation only.",
        zh_Hans: "OpenAPI 默认 hot。live 仅返回聚合结果。",
      },
      llmDescription: {
        en_US: "Allowed values: hot, latest, image, live.",
        zh_Hans: "只允许 hot、latest、image、live。",
      },
    }),
    kuaishouStringParameter({
      name: "tag_name",
      displayName: { en_US: "Tag Name", zh_Hans: "标签显示名" },
      hint: {
        en_US: "Recommended for topic tags; use the exact tag name.",
        zh_Hans: "话题标签建议填写准确标签名。",
      },
      llmDescription: {
        en_US: "Optional topic tag display name.",
        zh_Hans: "可选话题标签显示名。",
      },
      placeholder: { en_US: "Artificial intelligence", zh_Hans: "人工智能" },
    }),
    kuaishouIntegerParameter({
      name: "tag_type",
      default: 1,
      displayName: { en_US: "Tag Type", zh_Hans: "标签类型" },
      hint: {
        en_US:
          "OpenAPI default 1. Use 1 for topics and 29 for sound/music tags.",
        zh_Hans: "OpenAPI 默认 1。话题使用 1，声音/音乐标签使用 29。",
      },
      llmDescription: {
        en_US: "Tag type: 1 for topic, 29 for sound/music.",
        zh_Hans: "标签类型：1 为话题，29 为声音/音乐。",
      },
    }),
    kuaishouIntegerParameter({
      name: "tag_source",
      default: 2,
      displayName: { en_US: "Tag Source", zh_Hans: "标签来源" },
      hint: {
        en_US:
          "OpenAPI default 2. Use 2 from search or 3 from a photo sound tag.",
        zh_Hans: "OpenAPI 默认 2。搜索进入使用 2，作品页声音标签使用 3。",
      },
      llmDescription: {
        en_US: "Tag source: 2 for search, 3 for a photo sound tag.",
        zh_Hans: "标签来源：搜索使用 2，作品页声音标签使用 3。",
      },
    }),
    kuaishouStringParameter({
      name: "from_photo_id",
      displayName: { en_US: "Source Photo ID", zh_Hans: "源作品 ID" },
      hint: {
        en_US: "Optional source photoId. Keep it as a string.",
        zh_Hans: "可选源作品 photoId，按字符串保留。",
      },
      llmDescription: {
        en_US: "Optional source photo ID. Never convert long IDs to numbers.",
        zh_Hans: "可选源作品 ID。不要把长 ID 转成 number。",
      },
      placeholder: { en_US: "3x7gxp2zhgjv832", zh_Hans: "3x7gxp2zhgjv832" },
    }),
    pcursorParameter(),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeKuaishouGet(endpoint, args, {
      general_tag_id: readRequiredString(p, "general_tag_id"),
      tab: readEnum(p, "tab", tagTabValues, "hot"),
      tag_name: readOptionalTrimmed(p, "tag_name"),
      tag_type: String(readInteger(p, "tag_type", 1)),
      tag_source: String(readInteger(p, "tag_source", 2)),
      from_photo_id: readOptionalTrimmed(p, "from_photo_id"),
      pcursor: readOpaqueCursor(p),
    })
  },
}
