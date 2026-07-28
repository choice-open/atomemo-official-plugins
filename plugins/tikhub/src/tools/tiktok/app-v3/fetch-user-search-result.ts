import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { readRequiredStringParam } from "../../../lib/request"
import {
  countParameter,
  credentialParameter,
  invokeTikTokGet,
  keywordParameter,
  offsetParameter,
  readOptionalIntegerParam,
  readOptionalStringParam,
  stringParameter,
} from "./shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_user_search_result",
  method: "GET",
  path: "/api/v1/tiktok/app/v3/fetch_user_search_result",
}

export const tikhub_tiktok_fetch_user_search_result: ToolDefinition = {
  name: "tikhub_tiktok_fetch_user_search_result",
  display_name: {
    en_US: "TikTok · User Search",
    zh_Hans: "TikTok · 获取用户搜索结果",
  },
  description: {
    en_US:
      "Get TikTok user search results by keyword, with optional user filters.",
    zh_Hans: "根据关键词获取 TikTok 用户搜索结果，支持用户筛选参数。",
  },
  icon: "🎵",
  parameters: [
    credentialParameter,
    keywordParameter,
    offsetParameter,
    countParameter,
    stringParameter({
      name: "user_search_follower_count",
      default: "",
      displayName: { en_US: "Follower Count Filter", zh_Hans: "粉丝数筛选" },
      description: {
        en_US: "Optional follower count filter.",
        zh_Hans: "可选的粉丝数筛选条件。",
      },
      hint: {
        en_US: "Follower count filter. Leave empty to disable.",
        zh_Hans: "粉丝数筛选条件；留空表示不筛选。",
      },
    }),
    stringParameter({
      name: "user_search_profile_type",
      default: "",
      displayName: { en_US: "Profile Type Filter", zh_Hans: "账号类型筛选" },
      description: {
        en_US: "Optional profile type filter.",
        zh_Hans: "可选的账号类型筛选条件。",
      },
      hint: {
        en_US: "Profile type filter. Leave empty to disable.",
        zh_Hans: "账号类型筛选条件；留空表示不筛选。",
      },
    }),
    stringParameter({
      name: "user_search_other_pref",
      default: "",
      displayName: {
        en_US: "Other Preference Filter",
        zh_Hans: "其他偏好筛选",
      },
      description: {
        en_US: "Optional other preference filter.",
        zh_Hans: "可选的其他偏好筛选条件。",
      },
      hint: {
        en_US: "Other preference filter. Leave empty to disable.",
        zh_Hans: "其他偏好筛选条件；留空表示不筛选。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeTikTokGet(endpoint, args, {
      keyword: readRequiredStringParam(p, "keyword"),
      offset: readOptionalIntegerParam(p, "offset"),
      count: readOptionalIntegerParam(p, "count"),
      user_search_follower_count: readOptionalStringParam(
        p,
        "user_search_follower_count",
      ),
      user_search_profile_type: readOptionalStringParam(
        p,
        "user_search_profile_type",
      ),
      user_search_other_pref: readOptionalStringParam(
        p,
        "user_search_other_pref",
      ),
    })
  },
}
