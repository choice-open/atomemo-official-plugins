import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { hackerNewsApiRequest, normalizeSearchItem } from "./hacker-news-api"
import skill from "./skills/search-hacker-news.md"

const TAG_OPTIONS = [
  { value: "story", label: { en_US: "Story", zh_Hans: "文章" } },
  { value: "comment", label: { en_US: "Comment", zh_Hans: "评论" } },
  { value: "poll", label: { en_US: "Poll", zh_Hans: "投票" } },
  { value: "pollopt", label: { en_US: "Poll Option", zh_Hans: "投票选项" } },
  { value: "show_hn", label: { en_US: "Show HN", zh_Hans: "Show HN" } },
  { value: "ask_hn", label: { en_US: "Ask HN", zh_Hans: "Ask HN" } },
  { value: "front_page", label: { en_US: "Front Page", zh_Hans: "首页" } },
] as const

function normalizeString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null
}

function normalizeStoryId(value: unknown) {
  return typeof value === "number" && Number.isInteger(value) && value > 0
    ? value
    : null
}

function normalizeTags(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return [...new Set(value.filter((tag): tag is string => typeof tag === "string"))]
}

function normalizePage(value: unknown) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0
    ? value
    : 0
}

function normalizeBoolean(value: unknown) {
  return typeof value === "boolean" ? value : false
}

export const searchHackerNewsTool = {
  name: "search-hacker-news",
  display_name: t("SEARCH_HACKER_NEWS_TOOL_DISPLAY_NAME"),
  description: t("SEARCH_HACKER_NEWS_TOOL_DESCRIPTION"),
  icon: "📰",
  skill,
  parameters: [
    {
      name: "keyword",
      type: "string",
      default: "",
      min_length: 0,
      display_name: t("KEYWORD_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("KEYWORD_HINT"),
        placeholder: t("KEYWORD_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
      ai: { llm_description: t("KEYWORD_LLM_DESCRIPTION") },
    },
    {
      name: "page",
      type: "integer",
      default: 0,
      minimum: 0,
      display_name: t("PAGE_DISPLAY_NAME"),
      ui: {
        component: "number-input",
        hint: t("PAGE_HINT"),
        placeholder: t("PAGE_PLACEHOLDER"),
        support_expression: true,
        width: "small",
      },
      ai: { llm_description: t("PAGE_LLM_DESCRIPTION") },
    },
    {
      name: "results_per_page",
      type: "integer",
      default: 100,
      minimum: 1,
      maximum: 100,
      display_name: t("LIMIT_DISPLAY_NAME"),
      ui: {
        component: "number-input",
        hint: t("LIMIT_HINT"),
        placeholder: t("LIMIT_PLACEHOLDER"),
        support_expression: true,
        width: "small",
      },
      ai: { llm_description: t("LIMIT_LLM_DESCRIPTION") },
    },
    {
      name: "search_by_date",
      type: "boolean",
      default: false,
      display_name: t("SEARCH_BY_DATE_DISPLAY_NAME"),
      ui: {
        component: "switch",
        hint: t("SEARCH_BY_DATE_HINT"),
        support_expression: true,
        width: "small",
      },
      ai: { llm_description: t("SEARCH_BY_DATE_LLM_DESCRIPTION") },
    },
    {
      name: "tags",
      type: "array",
      default: [],
      display_name: t("TAGS_DISPLAY_NAME"),
      ui: {
        component: "multi-select",
        options: [...TAG_OPTIONS],
        hint: t("TAGS_HINT"),
        support_expression: true,
        width: "full",
      },
      items: {
        type: "string",
        name: "tag",
        display_name: t("TAGS_DISPLAY_NAME"),
        ai: { llm_description: t("TAGS_LLM_DESCRIPTION") },
      },
      ai: { llm_description: t("TAGS_LLM_DESCRIPTION") },
    },
    {
      name: "author",
      type: "string",
      default: "",
      min_length: 0,
      display_name: t("AUTHOR_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("AUTHOR_HINT"),
        placeholder: t("AUTHOR_PLACEHOLDER"),
        support_expression: true,
        width: "medium",
      },
      ai: { llm_description: t("AUTHOR_LLM_DESCRIPTION") },
    },
    {
      name: "story_id",
      type: "integer",
      minimum: 1,
      display_name: t("STORY_ID_DISPLAY_NAME"),
      ui: {
        component: "number-input",
        hint: t("STORY_ID_HINT"),
        placeholder: t("STORY_ID_PLACEHOLDER"),
        support_expression: true,
        width: "medium",
      },
      ai: { llm_description: t("STORY_ID_LLM_DESCRIPTION") },
    },
    {
      name: "numeric_filters",
      type: "string",
      default: "",
      min_length: 0,
      display_name: t("NUMERIC_FILTERS_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("NUMERIC_FILTERS_HINT"),
        placeholder: t("NUMERIC_FILTERS_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
      ai: { llm_description: t("NUMERIC_FILTERS_LLM_DESCRIPTION") },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      results_per_page?: number
      search_by_date?: boolean
      keyword?: string
      tags?: string[]
      page?: number
      author?: string
      story_id?: number
      numeric_filters?: string
    }

    const query = params.keyword ?? ""
    const searchByDate = normalizeBoolean(params.search_by_date)
    const tags = normalizeTags(params.tags)
    const page = normalizePage(params.page)
    const author = normalizeString(params.author)
    const storyId = normalizeStoryId(params.story_id)
    const numericFilters = normalizeString(params.numeric_filters)
    const algoliaTags = [
      ...tags,
      ...(author ? [`author_${author}`] : []),
      ...(storyId !== null ? [`story_${storyId}`] : []),
    ]

    const responseData = await hackerNewsApiRequest(
      searchByDate ? "search_by_date" : "search",
      {
        query,
        tags: algoliaTags.length > 0 ? algoliaTags.join(",") : "",
        numericFilters,
        page,
        hitsPerPage: params.results_per_page ?? 100,
      },
    )

    const items = Array.isArray(responseData.hits)
      ? responseData.hits.map(normalizeSearchItem)
      : []

    return {
      query,
      tags,
      total: typeof responseData.nbHits === "number" ? responseData.nbHits : 0,
      count: items.length,
      items,
    }
  },
} satisfies ToolDefinition
