import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  countParameter,
  credentialParameter,
  integerParameter,
  invokeTikTokGet,
  readOptionalIntegerParam,
  readOptionalStringParam,
  stringParameter,
} from "./shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_user_post_videos_v3",
  method: "GET",
  path: "/api/v1/tiktok/app/v3/fetch_user_post_videos_v3",
}

export const tikhub_tiktok_fetch_user_post_videos_v3: ToolDefinition = {
  name: "tikhub_tiktok_fetch_user_post_videos_v3",
  display_name: {
    en_US: "TikTok · Get User Videos V3",
    zh_Hans: "TikTok · 获取用户主页作品数据V3",
  },
  description: {
    en_US:
      "Get simplified TikTok user homepage video data V3 by sec_user_id or unique_id.",
    zh_Hans:
      "通过 sec_user_id 或 unique_id 获取 TikTok 用户主页作品数据V3（精简数据，更快速）。",
  },
  icon: "🎵",
  parameters: [
    credentialParameter,
    stringParameter({
      name: "sec_user_id",
      default: "",
      displayName: { en_US: "Sec User ID", zh_Hans: "Sec User ID" },
      description: {
        en_US: "TikTok sec_user_id. Provide this or unique_id.",
        zh_Hans: "TikTok sec_user_id。与 unique_id 至少填写一个。",
      },
      hint: {
        en_US: "TikTok sec_user_id. Leave empty if using unique_id.",
        zh_Hans: "TikTok sec_user_id；使用 unique_id 时可留空。",
      },
      placeholder: { en_US: "sec_user_id", zh_Hans: "sec_user_id" },
    }),
    stringParameter({
      name: "unique_id",
      default: "",
      displayName: { en_US: "Unique ID", zh_Hans: "用户 unique_id" },
      description: {
        en_US: "TikTok unique_id/username. Provide this or sec_user_id.",
        zh_Hans: "TikTok unique_id/用户名。与 sec_user_id 至少填写一个。",
      },
      hint: {
        en_US: "TikTok unique_id. Leave empty if using sec_user_id.",
        zh_Hans: "TikTok unique_id；使用 sec_user_id 时可留空。",
      },
      placeholder: { en_US: "unique_id", zh_Hans: "unique_id" },
    }),
    integerParameter({
      name: "max_cursor",
      default: 0,
      displayName: { en_US: "Max Cursor", zh_Hans: "最大游标" },
      description: {
        en_US: "Maximum pagination cursor, default 0.",
        zh_Hans: "分页最大游标，默认 0。",
      },
      hint: {
        en_US: "Maximum pagination cursor, default 0.",
        zh_Hans: "分页最大游标，默认 0。",
      },
    }),
    countParameter,
    integerParameter({
      name: "sort_type",
      default: 0,
      displayName: { en_US: "Sort Type", zh_Hans: "排序类型" },
      description: {
        en_US: "Sort type, default 0.",
        zh_Hans: "排序类型，默认 0。",
      },
      hint: { en_US: "Sort type, default 0.", zh_Hans: "排序类型，默认 0。" },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const secUserId = readOptionalStringParam(p, "sec_user_id")
    const uniqueId = readOptionalStringParam(p, "unique_id")
    if (!secUserId && !uniqueId) {
      throw new Error(
        "Missing required parameter: provide sec_user_id or unique_id",
      )
    }
    return invokeTikTokGet(endpoint, args, {
      sec_user_id: secUserId,
      unique_id: uniqueId,
      max_cursor: readOptionalIntegerParam(p, "max_cursor"),
      count: readOptionalIntegerParam(p, "count"),
      sort_type: readOptionalIntegerParam(p, "sort_type"),
    })
  },
}
