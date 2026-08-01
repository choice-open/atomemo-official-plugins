import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  fansSortValues,
  invokeKuaishouGet,
  kuaishouSelectParameter,
  kuaishouStringParameter,
  pcursorParameter,
  readEnum,
  readOpaqueCursor,
  readRequiredString,
  userGenderValues,
  userRelationValues,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "kuaishou_app_search_user_v2",
  method: "GET",
  path: "/api/v1/kuaishou/app/search_user_v2",
}

export const tikhub_kuaishou_user_search: ToolDefinition = {
  name: "tikhub_kuaishou_user_search",
  display_name: { en_US: "Kuaishou · User Search", zh_Hans: "快手 · 用户搜索" },
  description: {
    en_US:
      "Search Kuaishou users with the more stable V2 endpoint and relationship, gender, and fan-count filters. This endpoint is higher-priced; check the latest price in the TikHub dashboard.",
    zh_Hans:
      "使用稳定性更好的 V2 接口及关系、性别、粉丝数筛选搜索快手用户。该接口价格较高，请查看 TikHub 后台最新价格。",
  },
  icon: "🎬",
  parameters: [
    credentialParameter,
    kuaishouStringParameter({
      name: "keyword",
      required: true,
      displayName: { en_US: "Keyword", zh_Hans: "关键词" },
      hint: {
        en_US:
          "Required keyword. This stable V2 endpoint is higher-priced; check the TikHub dashboard.",
        zh_Hans:
          "必填关键词。稳定版 V2 接口价格较高，请查看 TikHub 后台最新价格。",
      },
      llmDescription: {
        en_US: "Required user search keyword.",
        zh_Hans: "用户搜索必填关键词。",
      },
      placeholder: { en_US: "Artificial intelligence", zh_Hans: "人工智能" },
    }),
    pcursorParameter(),
    kuaishouSelectParameter({
      name: "user_relation",
      values: userRelationValues,
      default: "all",
      displayName: { en_US: "Relationship", zh_Hans: "关系筛选" },
      hint: { en_US: "OpenAPI default all.", zh_Hans: "OpenAPI 默认 all。" },
      llmDescription: {
        en_US: "Allowed values: all, same_city, verified, live, following.",
        zh_Hans: "只允许 all、same_city、verified、live、following。",
      },
    }),
    kuaishouSelectParameter({
      name: "user_gender",
      values: userGenderValues,
      default: "all",
      displayName: { en_US: "Gender", zh_Hans: "性别筛选" },
      hint: { en_US: "OpenAPI default all.", zh_Hans: "OpenAPI 默认 all。" },
      llmDescription: {
        en_US: "Allowed values: all, male, female.",
        zh_Hans: "只允许 all、male、female。",
      },
    }),
    kuaishouSelectParameter({
      name: "fans_sort",
      values: fansSortValues,
      default: "default",
      displayName: { en_US: "Fans Sort", zh_Hans: "粉丝数排序" },
      hint: {
        en_US: "OpenAPI default default.",
        zh_Hans: "OpenAPI 默认 default。",
      },
      llmDescription: {
        en_US: "Allowed values: default, most_to_least, least_to_most.",
        zh_Hans: "只允许 default、most_to_least、least_to_most。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeKuaishouGet(endpoint, args, {
      keyword: readRequiredString(p, "keyword"),
      pcursor: readOpaqueCursor(p),
      user_relation: readEnum(p, "user_relation", userRelationValues, "all"),
      user_gender: readEnum(p, "user_gender", userGenderValues, "all"),
      fans_sort: readEnum(p, "fans_sort", fansSortValues, "default"),
    })
  },
}
