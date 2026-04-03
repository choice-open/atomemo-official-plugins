import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import {
  hackerNewsApiRequest,
  normalizeComment,
  normalizeItem,
} from "./hacker-news-api"
import skill from "./skills/get-hacker-news-article.md"

export const getHackerNewsArticleTool = {
  name: "get-hacker-news-article",
  display_name: t("GET_HACKER_NEWS_ARTICLE_TOOL_DISPLAY_NAME"),
  description: t("GET_HACKER_NEWS_ARTICLE_TOOL_DESCRIPTION"),
  icon: "📰",
  skill,
  parameters: [
    {
      name: "article_id",
      type: "string",
      required: true,
      default: "",
      min_length: 1,
      display_name: t("ARTICLE_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("ARTICLE_ID_HINT"),
        placeholder: t("ARTICLE_ID_PLACEHOLDER"),
        support_expression: true,
        width: "medium",
      },
      ai: { llm_description: t("ARTICLE_ID_LLM_DESCRIPTION") },
    },
    {
      name: "include_comments",
      type: "boolean",
      default: false,
      display_name: t("INCLUDE_COMMENTS_DISPLAY_NAME"),
      ui: {
        component: "switch",
        hint: t("INCLUDE_COMMENTS_HINT"),
        support_expression: true,
        width: "small",
      },
      ai: { llm_description: t("INCLUDE_COMMENTS_LLM_DESCRIPTION") },
    },
  ],
  async invoke({ args }): Promise<any> {
    const params = args.parameters as {
      article_id: string
      include_comments?: boolean
    }

    const responseData = await hackerNewsApiRequest(`items/${params.article_id}`)
    const item = normalizeItem(responseData)

    if (!params.include_comments) {
      return { item }
    }

    return {
      item,
      comments: Array.isArray(responseData.children)
        ? responseData.children.map(normalizeComment)
        : [],
    }
  },
} satisfies ToolDefinition
