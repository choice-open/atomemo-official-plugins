import type { BaseTranslation } from "../i18n-types"

const en_US = {
  PLUGIN_DISPLAY_NAME: "Hacker News",
  PLUGIN_DESCRIPTION: "Consume the Hacker News API powered by Algolia",
  SEARCH_HACKER_NEWS_TOOL_DISPLAY_NAME: "Search Hacker News",
  SEARCH_HACKER_NEWS_TOOL_DESCRIPTION:
    "Search stories and comments from Hacker News",
  GET_HACKER_NEWS_ARTICLE_TOOL_DISPLAY_NAME: "Get Hacker News Article",
  GET_HACKER_NEWS_ARTICLE_TOOL_DESCRIPTION:
    "Fetch a Hacker News item by ID, optionally including comments",
  GET_HACKER_NEWS_USER_TOOL_DISPLAY_NAME: "Get Hacker News User",
  GET_HACKER_NEWS_USER_TOOL_DESCRIPTION:
    "Fetch a Hacker News user profile by username",
  LIMIT_DISPLAY_NAME: "Results Per Page",
  LIMIT_HINT: "Maximum number of results to return per page",
  LIMIT_PLACEHOLDER: "100",
  LIMIT_LLM_DESCRIPTION:
    "Maximum number of search results to return per page. Range: 1-100",
  SEARCH_BY_DATE_DISPLAY_NAME: "Search By Date",
  SEARCH_BY_DATE_HINT:
    "Use Algolia's search_by_date endpoint to sort by newest first",
  SEARCH_BY_DATE_LLM_DESCRIPTION:
    "When true, calls the Hacker News Algolia search_by_date endpoint instead of search.",
  KEYWORD_DISPLAY_NAME: "Keyword",
  KEYWORD_HINT: "The keyword for filtering the results of the query",
  KEYWORD_PLACEHOLDER: "Launch HN, AI agents, YC",
  KEYWORD_LLM_DESCRIPTION:
    "Search query string for filtering Hacker News stories. Supports Algolia search syntax",
  TAGS_DISPLAY_NAME: "Tags",
  TAGS_HINT: "Optionally narrow results to one or more Hacker News item types",
  TAGS_LLM_DESCRIPTION:
    "Filter results by one or more Hacker News item tags: story, comment, poll, pollopt, show_hn, ask_hn, or front_page",
  AUTHOR_DISPLAY_NAME: "Author",
  AUTHOR_HINT: "Filter results to items by a specific Hacker News username",
  AUTHOR_PLACEHOLDER: "pg",
  AUTHOR_LLM_DESCRIPTION:
    "Optional Hacker News username filter. This is mapped to the Algolia tag syntax author_USERNAME.",
  PAGE_DISPLAY_NAME: "Page",
  PAGE_HINT: "Zero-based result page to fetch from the Hacker News Algolia API",
  PAGE_PLACEHOLDER: "0",
  PAGE_LLM_DESCRIPTION:
    "Optional zero-based page number for Algolia pagination.",
  STORY_ID_DISPLAY_NAME: "Story ID",
  STORY_ID_HINT: "Filter results to a specific Hacker News story ID context",
  STORY_ID_PLACEHOLDER: "8863",
  STORY_ID_LLM_DESCRIPTION:
    "Optional Hacker News story ID filter. This is mapped to the Algolia tag syntax story_ID.",
  NUMERIC_FILTERS_DISPLAY_NAME: "Numeric Filters",
  NUMERIC_FILTERS_HINT:
    "Advanced Algolia numericFilters string, for example created_at_i>1700000000 or points>100",
  NUMERIC_FILTERS_PLACEHOLDER: "created_at_i>1700000000",
  NUMERIC_FILTERS_LLM_DESCRIPTION:
    "Optional raw Algolia numericFilters query string, such as filters on created_at_i, points, or num_comments.",
  ARTICLE_ID_DISPLAY_NAME: "Article ID",
  ARTICLE_ID_HINT: "The ID of the Hacker News item to be returned",
  ARTICLE_ID_PLACEHOLDER: "Example: 8863",
  ARTICLE_ID_LLM_DESCRIPTION:
    "The unique identifier of a Hacker News item to fetch. Numeric ID from the URL",
  INCLUDE_COMMENTS_DISPLAY_NAME: "Include Comments",
  INCLUDE_COMMENTS_HINT:
    "Whether to include the full comment tree for the Hacker News item",
  INCLUDE_COMMENTS_LLM_DESCRIPTION:
    "When true, includes the full comment tree in the response. When false, returns only the normalized item metadata",
  USERNAME_DISPLAY_NAME: "Username",
  USERNAME_HINT: "The Hacker News username to return",
  USERNAME_PLACEHOLDER: "Example: pg",
  USERNAME_LLM_DESCRIPTION:
    "The Hacker News username to fetch profile information for",
} satisfies BaseTranslation

export default en_US
