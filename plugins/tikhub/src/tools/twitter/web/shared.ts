import type {
  JsonValue,
  Property,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

export const credentialParameter = {
  name: "credential_id",
  type: "credential_id",
  required: true,
  credential_name: "tikhub-api-key",
  display_name: { en_US: "Credential", zh_Hans: "凭证" },
  ui: { component: "credential-select" },
} satisfies Property<"credential_id">

export const SEARCH_TYPES = [
  "Top",
  "Latest",
  "Media",
  "People",
  "Lists",
] as const

export const TRENDING_COUNTRIES = [
  "UnitedStates",
  "China",
  "India",
  "Japan",
  "Russia",
  "Germany",
  "Indonesia",
  "Brazil",
  "France",
  "UnitedKingdom",
  "Turkey",
  "Italy",
  "Mexico",
  "SouthKorea",
  "Canada",
  "Spain",
  "SaudiArabia",
  "Egypt",
  "Australia",
  "Poland",
  "Iran",
  "Pakistan",
  "Vietnam",
  "Nigeria",
  "Bangladesh",
  "Netherlands",
  "Argentina",
  "Philippines",
  "Malaysia",
  "Colombia",
  "UniteArabEmirates",
  "Romania",
  "Belgium",
  "Switzerland",
  "Singapore",
  "Sweden",
  "Norway",
  "Austria",
  "Kazakhstan",
  "Algeria",
  "Chile",
  "Czechia",
  "Peru",
  "Iraq",
  "Israel",
  "Ukraine",
  "Denmark",
  "Portugal",
  "Hungary",
  "Greece",
  "Finland",
  "NewZealand",
  "Belarus",
  "Slovakia",
  "Serbia",
  "Lithuania",
  "Luxembourg",
  "Estonia",
] as const

export function twitterStringParameter<Name extends string>(options: {
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

export const tweetIdParameter = twitterStringParameter({
  name: "tweet_id",
  required: true,
  displayName: { en_US: "Tweet ID", zh_Hans: "推文 ID" },
  hint: {
    en_US: "Tweet ID from the X/Twitter status URL, passed as a string.",
    zh_Hans: "X/Twitter 推文链接中的 status ID，会以字符串传递。",
  },
  llmDescription: {
    en_US:
      "Tweet ID to fetch. It must be provided as a string to avoid numeric precision loss.",
    zh_Hans: "要查询的推文 ID。必须以字符串提供，避免数字精度丢失。",
  },
  placeholder: { en_US: "1808168603721650364", zh_Hans: "1808168603721650364" },
})

export const cursorParameter = twitterStringParameter({
  name: "cursor",
  required: false,
  displayName: { en_US: "Cursor", zh_Hans: "分页游标" },
  hint: {
    en_US:
      "Leave empty for the first page. For pagination, paste the cursor from the previous TikHub response unchanged.",
    zh_Hans: "首次请求留空。翻页时原样粘贴上一次 TikHub 响应中的游标。",
  },
  llmDescription: {
    en_US:
      "Optional pagination cursor. Pass the previous response cursor exactly as returned; do not parse or rewrite it.",
    zh_Hans: "可选分页游标。必须原样传入上次响应返回的游标，不要解析或改写。",
  },
  placeholder: { en_US: "Leave empty for first page", zh_Hans: "首次请求留空" },
})

export const screenNameParameter = (required = true): Property<"screen_name"> =>
  twitterStringParameter({
    name: "screen_name",
    required,
    displayName: { en_US: "Screen Name", zh_Hans: "用户名" },
    hint: {
      en_US: "X/Twitter handle without @, for example elonmusk.",
      zh_Hans: "不带 @ 的 X/Twitter 用户名，例如 elonmusk。",
    },
    llmDescription: {
      en_US:
        "X/Twitter screen name without @. Use this when rest_id is unavailable.",
      zh_Hans: "不带 @ 的 X/Twitter 用户名。没有 rest_id 时使用。",
    },
    placeholder: { en_US: "elonmusk", zh_Hans: "elonmusk" },
  })

export const restIdParameter: Property<"rest_id"> = {
  ...twitterStringParameter({
    name: "rest_id",
    required: false,
    displayName: { en_US: "User ID", zh_Hans: "用户 ID" },
    hint: {
      en_US:
        "X/Twitter numeric user ID, passed as a string. When provided together with screen_name, TikHub uses rest_id first.",
      zh_Hans:
        "X/Twitter 数字用户 ID，会以字符串传递。与用户名同时提供时 TikHub 优先使用 rest_id。",
    },
    llmDescription: {
      en_US:
        "Optional X/Twitter user ID. Provide it as a string to avoid numeric precision loss; it takes priority over screen_name when both are provided.",
      zh_Hans:
        "可选 X/Twitter 用户 ID。请以字符串提供避免数字精度丢失；与 screen_name 同时提供时优先。",
    },
    placeholder: { en_US: "44196397", zh_Hans: "44196397" },
  }),
  required: false,
}

export function readOptionalStringParam(
  params: Record<string, unknown>,
  name: string,
): string | undefined {
  const value = params[name]
  return typeof value === "string" ? value : undefined
}

export function readOptionalIdStringParam(
  params: Record<string, unknown>,
  name: string,
): string | undefined {
  const value = params[name]
  if (value === undefined || value === null || value === "") {
    return undefined
  }
  if (typeof value !== "string") {
    throw new Error(
      `${name} must be provided as a string to avoid numeric precision loss.`,
    )
  }
  return value.trim()
}

export function readRequiredIdStringParam(
  params: Record<string, unknown>,
  name: string,
): string {
  const value = params[name]
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${name} is required and must be provided as a string.`)
  }
  return value.trim()
}

export function readOptionalScreenName(
  params: Record<string, unknown>,
): string | undefined {
  const value = params.screen_name
  return typeof value === "string" && value.trim() !== ""
    ? value.trim()
    : undefined
}

export function readScreenNameOrRestId(params: Record<string, unknown>): {
  screen_name?: string
  rest_id?: string
} {
  const screenName = readOptionalScreenName(params)
  const restId = readOptionalIdStringParam(params, "rest_id")
  if (!screenName && !restId) {
    throw new Error("Provide at least one of screen_name or rest_id.")
  }
  return { screen_name: screenName, rest_id: restId }
}

export function invokeTwitterGet(
  endpoint: TikHubApiEndpoint,
  args: {
    parameters?: unknown
    credentials?: Record<string, unknown>
  },
  queryParams: Record<string, string | undefined>,
): Promise<JsonValue> {
  const p = (args.parameters ?? {}) as Record<string, unknown>
  const credentialId = readRequiredStringParam(p, "credential_id")
  return invokeTikHubApi(endpoint, {
    credentials: args.credentials,
    credentialId,
    queryParams,
  })
}
