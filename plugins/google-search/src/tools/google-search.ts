import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

const SEARCH_API_URL = "https://customsearch.googleapis.com/customsearch/v1"

const OPTIONAL_PARAMS = [
  "start",
  "dateRestrict",
  "exactTerms",
  "excludeTerms",
  "orTerms",
  "gl",
  "hl",
  "lr",
  "safe",
  "sort",
  "siteSearch",
  "siteSearchFilter",
  "filter",
  "fileType",
] as const

export const googleSearchTool = {
  name: "google-search",
  display_name: t("GOOGLE_SEARCH_TOOL_DISPLAY_NAME"),
  description: t("GOOGLE_SEARCH_TOOL_DESCRIPTION"),
  icon: "🔍",
  parameters: [
    {
      name: "api_credential",
      type: "credential_id",
      required: true,
      display_name: t("API_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "google-search-api",
    },
    {
      name: "query",
      type: "string",
      required: true,
      display_name: t("QUERY_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("QUERY_HINT"),
        placeholder: t("QUERY_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "num",
      type: "number",
      default: 5,
      minimum: 1,
      maximum: 10,
      display_name: t("NUM_RESULTS_DISPLAY_NAME"),
      ui: {
        component: "number-input",
        hint: t("NUM_RESULTS_HINT"),
      },
    },
    {
      name: "start",
      type: "number",
      minimum: 1,
      maximum: 91,
      display_name: t("START_DISPLAY_NAME"),
      ui: {
        component: "number-input",
        hint: t("START_HINT"),
      },
    },
    {
      name: "dateRestrict",
      type: "string",
      enum: ["d1", "w1", "m1", "y1"],
      display_name: t("DATE_RESTRICT_DISPLAY_NAME"),
      ui: {
        component: "select",
        hint: t("DATE_RESTRICT_HINT"),
      },
    },
    {
      name: "exactTerms",
      type: "string",
      display_name: t("EXACT_TERMS_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("EXACT_TERMS_HINT"),
        width: "full",
      },
    },
    {
      name: "excludeTerms",
      type: "string",
      display_name: t("EXCLUDE_TERMS_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("EXCLUDE_TERMS_HINT"),
        width: "full",
      },
    },
    {
      name: "orTerms",
      type: "string",
      display_name: t("OR_TERMS_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("OR_TERMS_HINT"),
        width: "full",
      },
    },
    {
      name: "gl",
      type: "string",
      display_name: t("GL_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("GL_HINT"),
        placeholder: t("GL_PLACEHOLDER"),
      },
    },
    {
      name: "hl",
      type: "string",
      display_name: t("HL_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("HL_HINT"),
        placeholder: t("HL_PLACEHOLDER"),
      },
    },
    {
      name: "lr",
      type: "string",
      enum: ["lang_en", "lang_zh-CN", "lang_zh-TW", "lang_ja", "lang_ko"],
      display_name: t("LR_DISPLAY_NAME"),
      ui: {
        component: "select",
        hint: t("LR_HINT"),
      },
    },
    {
      name: "safe",
      type: "string",
      enum: ["off", "active"],
      default: "off",
      display_name: t("SAFE_DISPLAY_NAME"),
      ui: {
        component: "select",
        hint: t("SAFE_HINT"),
      },
    },
    {
      name: "sort",
      type: "string",
      enum: ["relevance", "date"],
      default: "relevance",
      display_name: t("SORT_DISPLAY_NAME"),
      ui: {
        component: "select",
        hint: t("SORT_HINT"),
      },
    },
    {
      name: "siteSearch",
      type: "string",
      display_name: t("SITE_SEARCH_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("SITE_SEARCH_HINT"),
        placeholder: t("SITE_SEARCH_PLACEHOLDER"),
        width: "full",
      },
    },
    {
      name: "siteSearchFilter",
      type: "string",
      enum: ["i", "e"],
      display_name: t("SITE_SEARCH_FILTER_DISPLAY_NAME"),
      ui: {
        component: "select",
        hint: t("SITE_SEARCH_FILTER_HINT"),
      },
    },
    {
      name: "filter",
      type: "string",
      enum: ["0", "1"],
      display_name: t("FILTER_DISPLAY_NAME"),
      ui: {
        component: "select",
        hint: t("FILTER_HINT"),
      },
    },
    {
      name: "fileType",
      type: "string",
      enum: ["pdf", "doc", "xls", "ppt", "html"],
      display_name: t("FILE_TYPE_DISPLAY_NAME"),
      ui: {
        component: "select",
        hint: t("FILE_TYPE_HINT"),
      },
    },
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const credential_id = parameters?.api_credential
    const cred = credentials?.[credential_id]
    if (!cred?.api_key || !cred?.search_engine_id) {
      throw new Error(
        "Google Search requires a valid API credential with api_key and search_engine_id.",
      )
    }
    const { api_key, search_engine_id } = cred

    const url = new URL(SEARCH_API_URL)
    url.searchParams.set("key", api_key)
    url.searchParams.set("cx", search_engine_id)
    url.searchParams.set("q", parameters.query ?? "")
    url.searchParams.set("num", String(parameters.num ?? 5))

    for (const key of OPTIONAL_PARAMS) {
      const val = parameters[key]
      if (val == null || val === "") continue
      if (key === "sort" && val === "relevance") continue
      url.searchParams.set(key, String(val))
    }

    const resp = await fetch(url.toString())
    if (!resp.ok) {
      const errText = await resp.text()
      throw new Error(`Google Search API error (${resp.status}): ${errText}`)
    }

    const data = (await resp.json()) as {
      searchInformation?: { totalResults?: string }
      items?: Array<{
        title?: string
        link?: string
        snippet?: string
        displayLink?: string
      }>
      error?: { message?: string; code?: number }
    }

    if (data.error) {
      throw new Error(
        data.error.message ?? `API error: ${JSON.stringify(data.error)}`,
      )
    }

    const items = data.items ?? []
    const results = items.map((item) => ({
      title: item.title ?? "",
      link: item.link ?? "",
      snippet: item.snippet ?? "",
      displayLink: item.displayLink ?? "",
    }))

    return {
      totalResults: data.searchInformation?.totalResults ?? "0",
      results,
    }
  },
} satisfies ToolDefinition
