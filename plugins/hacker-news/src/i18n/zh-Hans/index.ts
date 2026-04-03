import type { Translation } from "../i18n-types"

const zh_Hans = {
  PLUGIN_DISPLAY_NAME: "Hacker News",
  PLUGIN_DESCRIPTION: "使用 Algolia 驱动的 Hacker News API",
  SEARCH_HACKER_NEWS_TOOL_DISPLAY_NAME: "搜索 Hacker News",
  SEARCH_HACKER_NEWS_TOOL_DESCRIPTION: "搜索 Hacker News 中的文章和评论",
  GET_HACKER_NEWS_ARTICLE_TOOL_DISPLAY_NAME: "获取 Hacker News 文章",
  GET_HACKER_NEWS_ARTICLE_TOOL_DESCRIPTION:
    "根据 ID 获取 Hacker News 条目，并可选择包含其评论树",
  GET_HACKER_NEWS_USER_TOOL_DISPLAY_NAME: "获取 Hacker News 用户",
  GET_HACKER_NEWS_USER_TOOL_DESCRIPTION:
    "根据用户名获取 Algolia API 暴露的 Hacker News 用户字段",
  LIMIT_DISPLAY_NAME: "每页结果数",
  LIMIT_HINT: "每页返回结果的最大数量",
  LIMIT_PLACEHOLDER: "100",
  LIMIT_LLM_DESCRIPTION: "每页返回搜索结果的最大数量。范围：1-100",
  SEARCH_BY_DATE_DISPLAY_NAME: "按日期搜索",
  SEARCH_BY_DATE_HINT: "使用 Algolia 的 search_by_date 端点按最新优先排序",
  SEARCH_BY_DATE_LLM_DESCRIPTION:
    "启用后调用 Hacker News Algolia 的 search_by_date 端点，而不是 search。",
  KEYWORD_DISPLAY_NAME: "关键词",
  KEYWORD_HINT: "用于过滤查询结果的关键词",
  KEYWORD_PLACEHOLDER: "Launch HN、AI agents、YC",
  KEYWORD_LLM_DESCRIPTION:
    "用于搜索 Hacker News 文章的查询字符串，支持 Algolia 搜索语法",
  TAGS_DISPLAY_NAME: "标签",
  TAGS_HINT: "可选地将结果限制为一个或多个 Hacker News 条目类型",
  TAGS_LLM_DESCRIPTION:
    "按一个或多个 Hacker News 标签过滤结果：story、comment、poll、pollopt、show_hn、ask_hn 或 front_page",
  AUTHOR_DISPLAY_NAME: "作者",
  AUTHOR_HINT: "将结果过滤为某个指定的 Hacker News 用户",
  AUTHOR_PLACEHOLDER: "pg",
  AUTHOR_LLM_DESCRIPTION:
    "可选的 Hacker News 用户名过滤条件，会映射为 Algolia 的 author_USERNAME 标签语法。",
  PAGE_DISPLAY_NAME: "页码",
  PAGE_HINT: "从 Hacker News Algolia API 获取的结果页码，从 0 开始",
  PAGE_PLACEHOLDER: "0",
  PAGE_LLM_DESCRIPTION: "可选的 Algolia 分页页码，从 0 开始。",
  STORY_ID_DISPLAY_NAME: "Story ID",
  STORY_ID_HINT: "将结果过滤到某个特定的 Hacker News 故事 ID 上下文",
  STORY_ID_PLACEHOLDER: "8863",
  STORY_ID_LLM_DESCRIPTION:
    "可选的 Hacker News 故事 ID 过滤条件，会映射为 Algolia 的 story_ID 标签语法。",
  NUMERIC_FILTERS_DISPLAY_NAME: "数值过滤",
  NUMERIC_FILTERS_HINT:
    "高级 Algolia numericFilters 字符串，例如 created_at_i>1700000000 或 points>100",
  NUMERIC_FILTERS_PLACEHOLDER: "created_at_i>1700000000",
  NUMERIC_FILTERS_LLM_DESCRIPTION:
    "可选的原始 Algolia numericFilters 查询字符串，例如针对 created_at_i、points 或 num_comments 的过滤。",
  ARTICLE_ID_DISPLAY_NAME: "文章 ID",
  ARTICLE_ID_HINT: "要返回的 Hacker News 条目 ID",
  ARTICLE_ID_PLACEHOLDER: "示例：8863",
  ARTICLE_ID_LLM_DESCRIPTION:
    "要获取的 Hacker News 条目的唯一标识符，URL 中的数字 ID",
  INCLUDE_COMMENTS_DISPLAY_NAME: "包含评论",
  INCLUDE_COMMENTS_HINT: "是否包含该 Hacker News 条目的完整评论树",
  INCLUDE_COMMENTS_LLM_DESCRIPTION:
    "启用时返回完整评论树，关闭时仅返回标准化后的条目元数据",
  USERNAME_DISPLAY_NAME: "用户名",
  USERNAME_HINT: "要返回的 Hacker News 用户名",
  USERNAME_PLACEHOLDER: "示例：pg",
  USERNAME_LLM_DESCRIPTION:
    "要获取 Algolia API 暴露用户字段的 Hacker News 用户名",
} satisfies Translation

export default zh_Hans
