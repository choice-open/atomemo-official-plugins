import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeiboGet,
  readUserIdOrCustom,
  weiboStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_user_info",
  method: "GET",
  path: "/api/v1/weibo/web_v2/fetch_user_info",
}

export const tikhub_weibo_user_info: ToolDefinition = {
  name: "tikhub_weibo_user_info",
  display_name: {
    en_US: "Weibo · Get User Info",
    zh_Hans: "微博 · 获取用户资料",
  },
  description: {
    en_US:
      "Get detailed Weibo user profile information by uid or custom username; uid takes priority.",
    zh_Hans:
      "根据 uid 或 custom 获取微博用户详细资料；两者同时提供时 uid 优先。",
  },
  icon: "👤",
  parameters: [
    credentialParameter,
    {
      ...weiboStringParameter({
        name: "uid",
        required: false,
        default: "",
        displayName: { en_US: "User ID", zh_Hans: "用户 ID" },
        hint: {
          en_US:
            "Weibo uid as a string. Provide uid or custom; uid takes priority.",
          zh_Hans: "微博 uid，字符串。uid 和 custom 至少提供一个；uid 优先。",
        },
        llmDescription: {
          en_US:
            "Optional Weibo uid. Provide it as a string. At least one of uid or custom is required; uid has priority.",
          zh_Hans:
            "可选微博 uid。请以字符串提供。uid 和 custom 至少提供一个；uid 优先。",
        },
      }),
      required: false,
    },
    weiboStringParameter({
      name: "custom",
      required: false,
      default: "",
      displayName: { en_US: "Custom Username", zh_Hans: "自定义用户名" },
      hint: {
        en_US: "Custom Weibo username. Used only when uid is empty.",
        zh_Hans: "微博自定义用户名。仅在 uid 为空时使用。",
      },
      llmDescription: {
        en_US:
          "Optional custom Weibo username. Use only when uid is unavailable; uid takes priority if both are provided.",
        zh_Hans: "可选微博自定义用户名。没有 uid 时使用；同时提供时 uid 优先。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeiboGet(endpoint, args, readUserIdOrCustom(p))
  },
}
