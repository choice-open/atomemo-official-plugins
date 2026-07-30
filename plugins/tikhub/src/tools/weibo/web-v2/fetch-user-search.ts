import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeiboGet,
  pageParameter,
  readOptionalIntegerParam,
  readOptionalStringParam,
  userAgeValues,
  userAuthValues,
  userGenderValues,
  weiboSelectParameter,
  weiboStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_user_search",
  method: "GET",
  path: "/api/v1/weibo/web_v2/fetch_user_search",
}

export const tikhub_weibo_user_search: ToolDefinition = {
  name: "tikhub_weibo_user_search",
  display_name: {
    en_US: "Weibo · Search Users",
    zh_Hans: "微博 · 搜索用户",
  },
  description: {
    en_US:
      "Search Weibo users by keyword and profile filters for competitor, audience, and lead discovery.",
    zh_Hans: "按关键词和用户筛选条件搜索微博用户，用于竞对、受众和潜客发现。",
  },
  icon: "👤",
  parameters: [
    credentialParameter,
    weiboStringParameter({
      name: "query",
      required: false,
      displayName: { en_US: "Query", zh_Hans: "搜索词" },
      hint: {
        en_US:
          "Optional user search keyword. If empty, only advanced filters are applied.",
        zh_Hans: "可选用户搜索关键词。留空时仅应用高级筛选参数。",
      },
      llmDescription: {
        en_US:
          "Optional Weibo user search keyword. Providing it performs broad user search; leaving it empty applies only filters.",
        zh_Hans:
          "可选微博用户搜索关键词。提供则执行全部搜索；留空则仅应用筛选条件。",
      },
    }),
    pageParameter,
    weiboStringParameter({
      name: "region",
      required: false,
      displayName: { en_US: "Region Code", zh_Hans: "地区编码" },
      hint: {
        en_US:
          "Optional Weibo region code. This release does not add city-list lookup.",
        zh_Hans: "可选微博地区编码。本期不新增城市列表查询。",
      },
      llmDescription: {
        en_US:
          "Optional Weibo region code. Treat it as an upstream code string and pass it unchanged.",
        zh_Hans: "可选微博地区编码。作为上游编码字符串原样传递。",
      },
    }),
    weiboSelectParameter({
      name: "auth",
      values: userAuthValues,
      displayName: { en_US: "Auth Type", zh_Hans: "认证类型" },
      hint: {
        en_US: "Optional: org_vip, per_vip, or ord.",
        zh_Hans: "可选：org_vip、per_vip、ord。",
      },
      llmDescription: {
        en_US:
          "Weibo user auth filter. Valid values: org_vip for organization, per_vip for personal verified, ord for ordinary.",
        zh_Hans:
          "微博用户认证筛选。有效值：org_vip 机构认证、per_vip 个人认证、ord 普通用户。",
      },
    }),
    weiboSelectParameter({
      name: "gender",
      values: userGenderValues,
      displayName: { en_US: "Gender", zh_Hans: "性别" },
      hint: {
        en_US: "Optional: man or women.",
        zh_Hans: "可选：man 或 women。",
      },
      llmDescription: {
        en_US: "Weibo gender filter. Valid values: man, women.",
        zh_Hans: "微博性别筛选。有效值：man、women。",
      },
    }),
    weiboSelectParameter({
      name: "age",
      values: userAgeValues,
      displayName: { en_US: "Age Bucket", zh_Hans: "年龄段" },
      hint: {
        en_US: "Optional: 18y, 22y, 29y, 39y, or 40y.",
        zh_Hans: "可选：18y、22y、29y、39y、40y。",
      },
      llmDescription: {
        en_US:
          "Weibo age bucket filter. Valid values: 18y, 22y, 29y, 39y, 40y.",
        zh_Hans: "微博年龄段筛选。有效值：18y、22y、29y、39y、40y。",
      },
    }),
    weiboStringParameter({
      name: "nickname",
      displayName: { en_US: "Nickname Filter", zh_Hans: "昵称筛选" },
      hint: { en_US: "Optional nickname filter.", zh_Hans: "可选昵称筛选。" },
      llmDescription: {
        en_US: "Optional Weibo nickname filter.",
        zh_Hans: "可选微博昵称筛选。",
      },
    }),
    weiboStringParameter({
      name: "tag",
      displayName: { en_US: "Tag Filter", zh_Hans: "标签筛选" },
      hint: {
        en_US: "Optional user tag filter.",
        zh_Hans: "可选用户标签筛选。",
      },
      llmDescription: {
        en_US: "Optional Weibo user tag filter.",
        zh_Hans: "可选微博用户标签筛选。",
      },
    }),
    weiboStringParameter({
      name: "school",
      displayName: { en_US: "School Filter", zh_Hans: "学校筛选" },
      hint: { en_US: "Optional school filter.", zh_Hans: "可选学校筛选。" },
      llmDescription: {
        en_US: "Optional Weibo user school filter.",
        zh_Hans: "可选微博用户学校筛选。",
      },
    }),
    weiboStringParameter({
      name: "work",
      displayName: { en_US: "Company Filter", zh_Hans: "公司筛选" },
      hint: {
        en_US: "Optional company/work filter.",
        zh_Hans: "可选公司或工作筛选。",
      },
      llmDescription: {
        en_US: "Optional Weibo user company or work filter.",
        zh_Hans: "可选微博用户公司或工作筛选。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeiboGet(endpoint, args, {
      query: readOptionalStringParam(p, "query"),
      page: readOptionalIntegerParam(p, "page") ?? "1",
      region: readOptionalStringParam(p, "region"),
      auth: readOptionalStringParam(p, "auth"),
      gender: readOptionalStringParam(p, "gender"),
      age: readOptionalStringParam(p, "age"),
      nickname: readOptionalStringParam(p, "nickname"),
      tag: readOptionalStringParam(p, "tag"),
      school: readOptionalStringParam(p, "school"),
      work: readOptionalStringParam(p, "work"),
    })
  },
}
